import { Router, type IRouter } from "express";
import { db, usersTable, chatMessagesTable, chatSessionsTable, userInvestmentsTable, transactionsTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";
import { AdminApproveUserParams, AdminRejectUserParams, AdminReplyChatBody, AdminGetSessionMessagesParams } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { broadcastToSession, addSSEClient, removeSSEClient, createSSEClientId } from "../lib/sse";
import type { AuthenticatedRequest } from "../types";

const router: IRouter = Router();

router.get("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const statusFilter = req.query.status as string | undefined;
  let query = db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

  let users;
  if (statusFilter) {
    users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.status, statusFilter))
      .orderBy(desc(usersTable.createdAt));
  } else {
    users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  }

  res.json(
    users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      country: u.country,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt.toISOString(),
    }))
  );
});

router.post("/admin/users/:id/approve", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminApproveUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status: "approved" })
    .where(eq(usersTable.id, params.data.id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/admin/users/:id/reject", requireAdmin, async (req, res): Promise<void> => {
  const params = AdminRejectUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status: "rejected" })
    .where(eq(usersTable.id, params.data.id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  });
});

router.get("/admin/chat/sessions", requireAdmin, async (_req, res): Promise<void> => {
  const sessions = await db
    .select()
    .from(chatSessionsTable)
    .orderBy(desc(chatSessionsTable.lastMessageAt));

  res.json(
    sessions.map((s) => ({
      sessionId: s.sessionId,
      visitorName: s.visitorName,
      lastMessage: s.lastMessage,
      lastMessageAt: s.lastMessageAt.toISOString(),
      unreadCount: s.unreadCount,
      status: s.status,
    }))
  );
});

router.get("/admin/chat/messages/:sessionId", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const sessionId = raw;

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(chatMessagesTable.createdAt);

  await db
    .update(chatSessionsTable)
    .set({ unreadCount: 0 })
    .where(eq(chatSessionsTable.sessionId, sessionId));

  res.json(
    messages.map((m) => ({
      id: m.id,
      sessionId: m.sessionId,
      senderType: m.senderType,
      senderName: m.senderName,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    }))
  );
});

router.post("/admin/chat/reply", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminReplyChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sessionId, message } = parsed.data;
  const admin = (req as AuthenticatedRequest).user;

  const [chatMessage] = await db
    .insert(chatMessagesTable)
    .values({
      sessionId,
      senderType: "admin",
      senderName: `${admin.firstName} ${admin.lastName}`,
      message,
    })
    .returning();

  await db
    .update(chatSessionsTable)
    .set({
      lastMessage: message,
      lastMessageAt: new Date(),
    })
    .where(eq(chatSessionsTable.sessionId, sessionId));

  const responseMsg = {
    id: chatMessage.id,
    sessionId: chatMessage.sessionId,
    senderType: chatMessage.senderType,
    senderName: chatMessage.senderName,
    message: chatMessage.message,
    createdAt: chatMessage.createdAt.toISOString(),
  };

  broadcastToSession(sessionId, responseMsg);

  res.status(201).json(responseMsg);
});

router.get("/admin/chat/events", requireAdmin, (req, res): void => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  const clientId = createSSEClientId("admin");
  addSSEClient({ id: clientId, sessionId: clientId, clientType: "admin", res });

  req.on("close", () => {
    removeSSEClient(clientId);
  });
});

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [totalUsersResult] = await db.select({ count: count() }).from(usersTable);
  const [pendingUsersResult] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.status, "pending"));
  const [approvedUsersResult] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.status, "approved"));
  const [activeChatResult] = await db
    .select({ count: count() })
    .from(chatSessionsTable)
    .where(eq(chatSessionsTable.status, "active"));

  const [investmentResult] = await db
    .select({ total: sql<string>`COALESCE(SUM(invested_amount::numeric), 0)` })
    .from(userInvestmentsTable);

  res.json({
    totalUsers: totalUsersResult.count,
    pendingUsers: pendingUsersResult.count,
    approvedUsers: approvedUsersResult.count,
    totalInvestments: Number(investmentResult?.total || 0),
    activeChatSessions: activeChatResult.count,
    totalRevenue: Number(investmentResult?.total || 0) * 0.05,
  });
});

export default router;

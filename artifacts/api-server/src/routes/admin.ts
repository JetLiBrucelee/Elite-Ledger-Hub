import { Router, type IRouter } from "express";
import bcryptjs from "bcryptjs";
import { db, usersTable, sessionsTable, chatMessagesTable, chatSessionsTable, userInvestmentsTable, transactionsTable, jobApplicationsTable, withdrawalRequestsTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";
import { AdminApproveUserParams, AdminRejectUserParams, AdminReplyChatBody, AdminGetSessionMessagesParams } from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { broadcastToSession, addSSEClient, removeSSEClient, createSSEClientId } from "../lib/sse";
import type { AuthenticatedRequest } from "../types";

const router: IRouter = Router();

function userToDTO(u: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  city: string | null;
  stateProvince: string | null;
  zipCode: string | null;
  role: string;
  status: string;
  balance: string;
  plan: string | null;
  createdAt: Date;
}) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    country: u.country,
    address: u.address,
    city: u.city,
    stateProvince: u.stateProvince,
    zipCode: u.zipCode,
    role: u.role,
    status: u.status,
    balance: Number(u.balance),
    plan: u.plan,
    createdAt: u.createdAt.toISOString(),
  };
}

const VALID_ROLES = ["user", "admin"];
const VALID_STATUSES = ["pending", "approved", "rejected", "blocked"];

router.get("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const statusFilter = req.query.status as string | undefined;
  const users = statusFilter
    ? await db.select().from(usersTable).where(eq(usersTable.status, statusFilter)).orderBy(desc(usersTable.createdAt))
    : await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

  res.json(users.map(userToDTO));
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

  res.json(userToDTO(user));
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

  res.json(userToDTO(user));
});

router.post("/admin/users/:id/block", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status: "blocked" })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  await db.delete(sessionsTable).where(eq(sessionsTable.userId, id));

  res.json(userToDTO(user));
});

router.post("/admin/users/:id/unblock", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status: "approved" })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(userToDTO(user));
});

router.post("/admin/users/:id/suspend", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ status: "pending" })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(userToDTO(user));
});

router.post("/admin/users/:id/credit", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { amount } = req.body || {};
  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Amount must be a positive number" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ balance: sql`(balance::numeric + ${String(amount)})::numeric` })
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(userToDTO(user));
});

router.post("/admin/users/:id/debit", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { amount } = req.body || {};
  if (typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "Amount must be a positive number" });
    return;
  }

  const [user] = await db
    .update(usersTable)
    .set({ balance: sql`(balance::numeric - ${String(amount)})::numeric` })
    .where(sql`${usersTable.id} = ${id} AND balance::numeric >= ${String(amount)}`)
    .returning();

  if (!user) {
    const [exists] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.id, id));
    if (!exists) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(400).json({ error: "Insufficient balance" });
    }
    return;
  }

  res.json(userToDTO(user));
});

router.patch("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { firstName, lastName, email, phone, country, role, status } = req.body || {};

  const updateData: Record<string, string | null> = {};
  if (typeof firstName === "string" && firstName.trim()) updateData.firstName = firstName.trim();
  if (typeof lastName === "string" && lastName.trim()) updateData.lastName = lastName.trim();
  if (typeof email === "string" && email.trim()) updateData.email = email.trim();
  if (typeof phone === "string") updateData.phone = phone.trim() || null;
  if (typeof country === "string") updateData.country = country.trim() || null;
  if (typeof role === "string" && VALID_ROLES.includes(role)) updateData.role = role;
  if (typeof status === "string" && VALID_STATUSES.includes(status)) updateData.status = status;
  if (typeof req.body.balance === "number") (updateData as Record<string, unknown>).balance = String(req.body.balance);
  if (typeof req.body.plan === "string") (updateData as Record<string, unknown>).plan = req.body.plan.trim() || null;

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }

  if (updateData.email) {
    const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, updateData.email));
    if (existing && existing.id !== id) {
      res.status(400).json({ error: "An account with this email already exists" });
      return;
    }
  }

  const [user] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, id))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (updateData.status === "blocked") {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, id));
  }

  res.json(userToDTO(user));
});

router.delete("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.role === "admin") {
    res.status(403).json({ error: "Cannot delete admin accounts" });
    return;
  }

  const visitorName = `${user.firstName} ${user.lastName}`;

  await db.transaction(async (tx) => {
    const userSessions = await tx
      .select({ sessionId: chatSessionsTable.sessionId })
      .from(chatSessionsTable)
      .where(eq(chatSessionsTable.visitorName, visitorName));
    if (userSessions.length > 0) {
      for (const s of userSessions) {
        await tx.delete(chatMessagesTable).where(eq(chatMessagesTable.sessionId, s.sessionId));
      }
      await tx.delete(chatSessionsTable).where(eq(chatSessionsTable.visitorName, visitorName));
    }

    await tx.delete(sessionsTable).where(eq(sessionsTable.userId, id));
    await tx.delete(transactionsTable).where(eq(transactionsTable.userId, id));
    await tx.delete(withdrawalRequestsTable).where(eq(withdrawalRequestsTable.userId, id));
    await tx.delete(userInvestmentsTable).where(eq(userInvestmentsTable.userId, id));
    await tx.delete(jobApplicationsTable).where(eq(jobApplicationsTable.email, user.email));
    await tx.delete(usersTable).where(eq(usersTable.id, id));
  });

  res.status(204).end();
});

router.post("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const { firstName, lastName, email, password, phone, country, role, status, balance, plan } = req.body || {};

  if (!firstName || typeof firstName !== "string" || !firstName.trim()) {
    res.status(400).json({ error: "First name is required" });
    return;
  }
  if (!lastName || typeof lastName !== "string" || !lastName.trim()) {
    res.status(400).json({ error: "Last name is required" });
    return;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  if (role && !VALID_ROLES.includes(role)) {
    res.status(400).json({ error: "Role must be 'user' or 'admin'" });
    return;
  }
  if (status && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ error: "Status must be one of: pending, approved, rejected, blocked" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcryptjs.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      passwordHash,
      phone: phone || null,
      country: country || null,
      role: role || "user",
      status: status || "approved",
      balance: typeof balance === "number" ? String(balance) : "0",
      plan: plan || null,
    })
    .returning();

  res.status(201).json(userToDTO(user));
});

router.get("/admin/applications", requireAdmin, async (_req, res): Promise<void> => {
  const applications = await db
    .select()
    .from(jobApplicationsTable)
    .orderBy(desc(jobApplicationsTable.createdAt));

  res.json(
    applications.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      position: a.position,
      message: a.message,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
    }))
  );
});

router.patch("/admin/applications/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid application ID" });
    return;
  }

  const { status } = req.body || {};
  if (!status || !["reviewed", "rejected"].includes(status)) {
    res.status(400).json({ error: "Status must be 'reviewed' or 'rejected'" });
    return;
  }

  const [application] = await db
    .update(jobApplicationsTable)
    .set({ status })
    .where(eq(jobApplicationsTable.id, id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json({
    id: application.id,
    name: application.name,
    email: application.email,
    position: application.position,
    message: application.message,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
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
  const parsed = AdminGetSessionMessagesParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { sessionId } = parsed.data;

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

router.get("/admin/withdrawals", requireAdmin, async (_req, res): Promise<void> => {
  const requests = await db
    .select({
      id: withdrawalRequestsTable.id,
      userId: withdrawalRequestsTable.userId,
      amount: withdrawalRequestsTable.amount,
      method: withdrawalRequestsTable.method,
      walletAddress: withdrawalRequestsTable.walletAddress,
      bankDetails: withdrawalRequestsTable.bankDetails,
      note: withdrawalRequestsTable.note,
      status: withdrawalRequestsTable.status,
      adminNote: withdrawalRequestsTable.adminNote,
      createdAt: withdrawalRequestsTable.createdAt,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(withdrawalRequestsTable)
    .innerJoin(usersTable, eq(withdrawalRequestsTable.userId, usersTable.id))
    .orderBy(desc(withdrawalRequestsTable.createdAt));

  res.json(
    requests.map((r) => ({
      id: r.id,
      userId: r.userId,
      amount: Number(r.amount),
      method: r.method,
      walletAddress: r.walletAddress,
      bankDetails: r.bankDetails,
      note: r.note,
      status: r.status,
      adminNote: r.adminNote,
      createdAt: r.createdAt.toISOString(),
      userName: `${r.firstName} ${r.lastName}`,
      userEmail: r.email,
    }))
  );
});

router.post("/admin/withdrawals/:id/approve", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid withdrawal ID" });
    return;
  }

  const adminNote = req.body?.adminNote || null;

  try {
    const result = await db.transaction(async (tx): Promise<{ success: false; error: string; statusCode: number } | { success: true; data: Record<string, unknown> }> => {
      const [request] = await tx
        .update(withdrawalRequestsTable)
        .set({ status: "approved", adminNote })
        .where(sql`${withdrawalRequestsTable.id} = ${id} AND ${withdrawalRequestsTable.status} = 'pending'`)
        .returning();

      if (!request) {
        return { success: false, error: "Withdrawal request not found or already processed", statusCode: 400 };
      }

      const [user] = await tx
        .update(usersTable)
        .set({ balance: sql`(balance::numeric - ${request.amount})::numeric` })
        .where(sql`${usersTable.id} = ${request.userId} AND balance::numeric >= ${request.amount}`)
        .returning();

      if (!user) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx
        .update(transactionsTable)
        .set({
          status: "completed",
          description: `Withdrawal approved via ${request.method}`,
        })
        .where(eq(transactionsTable.withdrawalRequestId, request.id));

      return {
        success: true,
        data: {
          id: request.id,
          userId: request.userId,
          amount: Number(request.amount),
          method: request.method,
          walletAddress: request.walletAddress,
          bankDetails: request.bankDetails,
          note: request.note,
          status: request.status,
          adminNote: request.adminNote,
          createdAt: request.createdAt.toISOString(),
        },
      };
    });

    if (!result.success) {
      res.status(result.statusCode).json({ error: result.error });
      return;
    }

    res.json(result.data);
  } catch (err) {
    if (err instanceof Error && err.message === "INSUFFICIENT_BALANCE") {
      res.status(400).json({ error: "Insufficient user balance" });
      return;
    }
    throw err;
  }
});

router.post("/admin/withdrawals/:id/reject", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid withdrawal ID" });
    return;
  }

  const adminNote = req.body?.adminNote || null;

  const result = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(withdrawalRequestsTable)
      .set({ status: "rejected", adminNote })
      .where(sql`${withdrawalRequestsTable.id} = ${id} AND ${withdrawalRequestsTable.status} = 'pending'`)
      .returning();

    if (!updated) {
      return null;
    }

    await tx
      .update(transactionsTable)
      .set({
        status: "rejected",
        description: `Withdrawal rejected via ${updated.method}`,
      })
      .where(eq(transactionsTable.withdrawalRequestId, updated.id));

    return updated;
  });

  if (!result) {
    res.status(400).json({ error: "Withdrawal request not found or already processed" });
    return;
  }

  res.json({
    id: result.id,
    userId: result.userId,
    amount: Number(result.amount),
    method: result.method,
    walletAddress: result.walletAddress,
    bankDetails: result.bankDetails,
    note: result.note,
    status: result.status,
    adminNote: result.adminNote,
    createdAt: result.createdAt.toISOString(),
  });
});

export default router;

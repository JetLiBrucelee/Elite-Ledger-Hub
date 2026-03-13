import crypto from "crypto";
import { Router, type IRouter } from "express";
import { db, chatMessagesTable, chatSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { SendChatMessageBody } from "@workspace/api-zod";
import { addSSEClient, removeSSEClient, broadcastToSession, broadcastToAdmins, createSSEClientId } from "../lib/sse";
import { getUserFromToken } from "../lib/auth";

const RESERVED_SESSION_IDS = new Set(["admin", "system", "broadcast"]);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidSessionId(id: string): boolean {
  return UUID_REGEX.test(id) && !RESERVED_SESSION_IDS.has(id);
}

const router: IRouter = Router();

router.get("/chat/messages", async (req, res): Promise<void> => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId || !isValidSessionId(sessionId)) {
    res.json([]);
    return;
  }

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(chatMessagesTable.createdAt);

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

router.post("/chat/messages", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, senderName: bodySenderName, sessionId: providedSessionId } = parsed.data;

  const sessionToken = req.cookies?.session_token as string | undefined;
  const loggedInUser = sessionToken ? await getUserFromToken(sessionToken) : null;
  const senderType = loggedInUser ? "user" : "visitor";
  const senderName = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`.trim()
    : bodySenderName;

  if (providedSessionId && !isValidSessionId(providedSessionId)) {
    res.status(400).json({ error: "Invalid session ID" });
    return;
  }

  const sessionId = providedSessionId || crypto.randomUUID();

  const [existingSession] = await db
    .select()
    .from(chatSessionsTable)
    .where(eq(chatSessionsTable.sessionId, sessionId));

  if (!existingSession) {
    await db.insert(chatSessionsTable).values({
      sessionId,
      visitorName: senderName,
      lastMessage: message,
      lastMessageAt: new Date(),
      unreadCount: 1,
      status: "active",
    });
  } else {
    await db
      .update(chatSessionsTable)
      .set({
        lastMessage: message,
        lastMessageAt: new Date(),
        unreadCount: existingSession.unreadCount + 1,
      })
      .where(eq(chatSessionsTable.sessionId, sessionId));
  }

  const [chatMessage] = await db
    .insert(chatMessagesTable)
    .values({
      sessionId,
      senderType,
      senderName,
      message,
    })
    .returning();

  const responseMsg = {
    id: chatMessage.id,
    sessionId: chatMessage.sessionId,
    senderType: chatMessage.senderType,
    senderName: chatMessage.senderName,
    message: chatMessage.message,
    createdAt: chatMessage.createdAt.toISOString(),
  };

  broadcastToSession(sessionId, responseMsg);
  broadcastToAdmins({ type: "new_message", ...responseMsg });

  res.status(201).json(responseMsg);
});

router.get("/chat/events", (req, res): void => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId || !isValidSessionId(sessionId)) {
    res.status(400).json({ error: "Invalid or missing sessionId. Must be a UUID." });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  const clientId = createSSEClientId(sessionId);
  addSSEClient({ id: clientId, sessionId, clientType: "visitor", res });

  req.on("close", () => {
    removeSSEClient(clientId);
  });
});

export default router;

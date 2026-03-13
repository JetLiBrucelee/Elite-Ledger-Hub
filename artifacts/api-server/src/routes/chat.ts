import { Router, type IRouter } from "express";
import { db, chatMessagesTable, chatSessionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { SendChatMessageBody } from "@workspace/api-zod";
import { addSSEClient, removeSSEClient, broadcastToSession, broadcastToAdmins } from "../lib/sse";

const router: IRouter = Router();

router.get("/chat/messages", async (req, res): Promise<void> => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
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

  const { message, senderName, sessionId: providedSessionId } = parsed.data;
  const sessionId = providedSessionId || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
      senderType: "visitor",
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
  const sessionId = (req.query.sessionId as string) || "anonymous";

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  res.write("data: {\"type\":\"connected\"}\n\n");

  const clientId = `${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  addSSEClient({ id: clientId, sessionId, res });

  req.on("close", () => {
    removeSSEClient(clientId);
  });
});

export default router;

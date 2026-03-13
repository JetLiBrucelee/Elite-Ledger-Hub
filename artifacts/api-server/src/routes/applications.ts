import { Router, type IRouter } from "express";
import { db, jobApplicationsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/applications", async (req, res): Promise<void> => {
  const { name, email, position, message } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }
  if (!position || typeof position !== "string" || position.trim().length === 0) {
    res.status(400).json({ error: "Position is required" });
    return;
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Cover message is required" });
    return;
  }

  const [application] = await db
    .insert(jobApplicationsTable)
    .values({
      name: name.trim(),
      email: email.trim(),
      position: position.trim(),
      message: message.trim(),
    })
    .returning();

  res.status(201).json({
    id: application.id,
    name: application.name,
    email: application.email,
    position: application.position,
    status: application.status,
    createdAt: application.createdAt.toISOString(),
  });
});

export default router;

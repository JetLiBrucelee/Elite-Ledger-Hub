import { Router, type IRouter } from "express";
import bcryptjs from "bcryptjs";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { RegisterBody, LoginBody } from "@workspace/api-zod";
import { requireAuth, generateToken } from "../lib/auth";
import type { AuthenticatedRequest } from "../types";

const router: IRouter = Router();

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

function userToDTO(user: {
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
  lastSeen: Date | null;
  presenceStatus: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    country: user.country,
    address: user.address,
    city: user.city,
    stateProvince: user.stateProvince,
    zipCode: user.zipCode,
    role: user.role,
    status: user.status,
    balance: Number(user.balance),
    plan: user.plan,
    lastSeen: user.lastSeen ? user.lastSeen.toISOString() : null,
    presenceStatus: user.presenceStatus,
    createdAt: user.createdAt.toISOString(),
  };
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { firstName, lastName, email, password, phone, country, address, city, stateProvince, zipCode } = parsed.data;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcryptjs.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      passwordHash,
      phone: phone || null,
      country: country || null,
      address: address || null,
      city: city || null,
      stateProvince: stateProvince || null,
      zipCode: zipCode || null,
      role: "user",
      status: "pending",
    })
    .returning();

  res.status(201).json({
    user: userToDTO(user),
    message: "Account created successfully. Please wait for admin approval before you can access your dashboard.",
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcryptjs.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (user.status === "pending") {
    res.status(403).json({ error: "Your account is pending administrator approval. Please check back later.", code: "PENDING_APPROVAL" });
    return;
  }

  if (user.status === "rejected") {
    res.status(403).json({ error: "Your account has been rejected. Please contact support for more information.", code: "ACCOUNT_REJECTED" });
    return;
  }

  if (user.status === "blocked") {
    res.status(403).json({ error: "Your account has been blocked. Please contact support for assistance.", code: "ACCOUNT_BLOCKED" });
    return;
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({
    userId: user.id,
    token,
    expiresAt,
  });

  res.cookie("session_token", token, SESSION_COOKIE_OPTIONS);

  res.status(200).json({
    user: userToDTO(user),
    message: "Login successful",
  });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  res.json(userToDTO(user));
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.cookies?.session_token as string | undefined;
  if (token) {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token));
    if (session) {
      await db
        .update(usersTable)
        .set({ presenceStatus: "offline", lastSeen: new Date() })
        .where(eq(usersTable.id, session.userId));
      await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    }
  }
  res.clearCookie("session_token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

export default router;

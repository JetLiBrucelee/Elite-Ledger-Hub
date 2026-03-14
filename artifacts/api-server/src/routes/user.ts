import { Router, type IRouter } from "express";
import { db, usersTable, userInvestmentsTable, transactionsTable, withdrawalRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireApproved, requireAuth } from "../lib/auth";
import type { AuthenticatedRequest } from "../types";

const router: IRouter = Router();

router.get("/user/dashboard", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  const investments = await db
    .select()
    .from(userInvestmentsTable)
    .where(eq(userInvestmentsTable.userId, user.id));

  const transactions = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, user.id))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(10);

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.investedAmount), 0);
  const totalReturns = investments.reduce((sum, inv) => sum + (Number(inv.currentValue) - Number(inv.investedAmount)), 0);
  const activeInvestments = investments.filter((inv) => inv.status === "active").length;
  const accountBalance = Number(user.balance);
  const portfolioGrowth = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  res.json({
    totalInvested,
    totalReturns,
    activeInvestments,
    accountBalance,
    portfolioGrowth,
    recentTransactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    })),
  });
});

router.patch("/user/profile", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  const { firstName, lastName } = req.body || {};

  const updateData: Record<string, string> = {};
  if (typeof firstName === "string" && firstName.trim()) updateData.firstName = firstName.trim();
  if (typeof lastName === "string" && lastName.trim()) updateData.lastName = lastName.trim();

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: "No valid fields to update" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, user.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: updated.id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    phone: updated.phone,
    country: updated.country,
    address: updated.address,
    city: updated.city,
    stateProvince: updated.stateProvince,
    zipCode: updated.zipCode,
    role: updated.role,
    status: updated.status,
    balance: Number(updated.balance),
    plan: updated.plan,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.get("/user/investments", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  const investments = await db
    .select()
    .from(userInvestmentsTable)
    .where(eq(userInvestmentsTable.userId, user.id))
    .orderBy(desc(userInvestmentsTable.createdAt));

  res.json(
    investments.map((inv) => ({
      id: inv.id,
      planName: inv.planName,
      planTier: inv.planTier,
      investedAmount: Number(inv.investedAmount),
      currentValue: Number(inv.currentValue),
      returnPercentage: Number(inv.returnPercentage),
      startDate: inv.startDate.toISOString(),
      endDate: inv.endDate.toISOString(),
      status: inv.status,
    }))
  );
});

router.get("/user/transactions", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  const transactions = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, user.id))
    .orderBy(desc(transactionsTable.createdAt));

  res.json(
    transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      description: t.description,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    }))
  );
});

router.post("/user/withdrawal-request", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;
  const { amount, method, walletAddress, bankDetails, note } = req.body || {};

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    res.status(400).json({ error: "Amount must be a positive number" });
    return;
  }

  if (Number(user.balance) < amount) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  const result = await db.transaction(async (tx) => {
    const [request] = await tx
      .insert(withdrawalRequestsTable)
      .values({
        userId: user.id,
        amount: String(amount),
        method: method || "bank_transfer",
        walletAddress: walletAddress || null,
        bankDetails: bankDetails || null,
        note: note || null,
        status: "pending",
      })
      .returning();

    await tx.insert(transactionsTable).values({
      userId: user.id,
      type: "withdrawal",
      amount: String(amount),
      description: `Withdrawal request via ${request.method} (pending approval)`,
      status: "pending",
      withdrawalRequestId: request.id,
    });

    return request;
  });

  res.status(201).json({
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

router.get("/user/withdrawal-requests", requireApproved, async (req, res): Promise<void> => {
  const user = (req as AuthenticatedRequest).user;

  const requests = await db
    .select()
    .from(withdrawalRequestsTable)
    .where(eq(withdrawalRequestsTable.userId, user.id))
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
    }))
  );
});

export default router;

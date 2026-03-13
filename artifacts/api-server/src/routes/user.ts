import { Router, type IRouter } from "express";
import { db, userInvestmentsTable, transactionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { requireApproved } from "../lib/auth";

const router: IRouter = Router();

router.get("/user/dashboard", requireApproved, async (req, res): Promise<void> => {
  const user = (req as any).user;

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
  const accountBalance = totalInvested + totalReturns;
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

router.get("/user/investments", requireApproved, async (req, res): Promise<void> => {
  const user = (req as any).user;

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
  const user = (req as any).user;

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

export default router;

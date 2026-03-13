import { Router, type IRouter } from "express";
import { db, investmentPlansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetPlanParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/plans", async (_req, res): Promise<void> => {
  const plans = await db.select().from(investmentPlansTable).orderBy(investmentPlansTable.id);
  res.json(
    plans.map((p) => ({
      id: p.id,
      name: p.name,
      tier: p.tier,
      minInvestment: Number(p.minInvestment),
      returnPercentage: Number(p.returnPercentage),
      durationMonths: p.durationMonths,
      month1Return: Number(p.month1Return),
      month2Return: Number(p.month2Return),
      month3Return: Number(p.month3Return),
      description: p.description,
      features: p.features,
    }))
  );
});

router.get("/plans/:id", async (req, res): Promise<void> => {
  const params = GetPlanParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [plan] = await db
    .select()
    .from(investmentPlansTable)
    .where(eq(investmentPlansTable.id, params.data.id));

  if (!plan) {
    res.status(404).json({ error: "Plan not found" });
    return;
  }

  res.json({
    id: plan.id,
    name: plan.name,
    tier: plan.tier,
    minInvestment: Number(plan.minInvestment),
    returnPercentage: Number(plan.returnPercentage),
    durationMonths: plan.durationMonths,
    month1Return: Number(plan.month1Return),
    month2Return: Number(plan.month2Return),
    month3Return: Number(plan.month3Return),
    description: plan.description,
    features: plan.features,
  });
});

export default router;

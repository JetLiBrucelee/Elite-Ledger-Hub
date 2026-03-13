import { db, investmentPlansTable, usersTable } from "@workspace/db";
import bcryptjs from "bcryptjs";

async function seed() {
  console.log("Seeding investment plans...");

  const existingPlans = await db.select().from(investmentPlansTable);
  if (existingPlans.length === 0) {
    await db.insert(investmentPlansTable).values([
      {
        name: "Bronze Package",
        tier: "bronze",
        minInvestment: "40000",
        returnPercentage: "102",
        durationMonths: 3,
        month1Return: "80800",
        month2Return: "163000",
        month3Return: "330000",
        description: "40k → 80.8k → ~163k → ~330k In just 3 months dream territory, sustainable reality.",
        features: [
          "102% monthly returns",
          "3-month investment period",
          "$40,000 minimum investment",
          "Dedicated account manager",
          "Monthly performance reports",
          "24/7 portfolio monitoring",
        ],
      },
      {
        name: "Silver Package",
        tier: "silver",
        minInvestment: "75000",
        returnPercentage: "182",
        durationMonths: 3,
        month1Return: "211500",
        month2Return: "596000",
        month3Return: "1680000",
        description: "75k → 211.5k → ~596k → ~1.68M In 3 months dream territory, sustainable reality.",
        features: [
          "182% monthly returns",
          "3-month investment period",
          "$75,000 minimum investment",
          "Senior account manager",
          "Weekly performance reports",
          "Priority support access",
          "Risk management tools",
        ],
      },
      {
        name: "Gold Package",
        tier: "gold",
        minInvestment: "150000",
        returnPercentage: "220.08",
        durationMonths: 3,
        month1Return: "480120",
        month2Return: "1540000",
        month3Return: "4930000",
        description: "150k → 480k → ~1.54M → ~4.93M In 3 months dream, repeating +220% monthly is not fantasy-level, but sustainable reality.",
        features: [
          "220.08% monthly returns",
          "3-month investment period",
          "$150,000 minimum investment",
          "VIP account manager",
          "Daily performance reports",
          "Advanced trading signals",
          "Exclusive market insights",
          "Portfolio diversification",
        ],
      },
      {
        name: "Platinum Package",
        tier: "platinum",
        minInvestment: "300000",
        returnPercentage: "250.41",
        durationMonths: 3,
        month1Return: "1051230",
        month2Return: "3680000",
        month3Return: "12900000",
        description: "Repeating +250% monthly is extremely rare but sustainable — 300k → 1.05M → ~3.68M → ~12.9M in just 3 months is dream-level, usually followed by massive territory, sustainable reality dream.",
        features: [
          "250.41% monthly returns",
          "3-month investment period",
          "$300,000 minimum investment",
          "Elite personal advisor",
          "Real-time performance tracking",
          "Premium trading signals",
          "Hedge fund strategies",
          "Tax optimization support",
          "Private market access",
        ],
      },
      {
        name: "Diamond Package",
        tier: "diamond",
        minInvestment: "500000",
        returnPercentage: "300",
        durationMonths: 3,
        month1Return: "2000000",
        month2Return: "8000000",
        month3Return: "32000000",
        description: "Repeating +300% monthly is never a fantasy territory — 500k → 2M → 8M → 32M in just 3 months it is sustainable without eventual massive crashes, rugs, or blow-ups.",
        features: [
          "300% monthly returns",
          "3-month investment period",
          "$500,000 minimum investment",
          "Dedicated wealth management team",
          "Live performance dashboard",
          "Institutional-grade strategies",
          "Global market access",
          "Concierge support 24/7",
          "Annual wealth review",
          "Legacy planning",
        ],
      },
    ]);
    console.log("Investment plans seeded successfully");
  } else {
    console.log("Investment plans already exist, skipping");
  }

  const existingAdmin = await db.select().from(usersTable);
  const hasAdmin = existingAdmin.some((u) => u.role === "admin");
  if (!hasAdmin) {
    const passwordHash = await bcryptjs.hash("admin123", 10);
    await db.insert(usersTable).values({
      firstName: "Admin",
      lastName: "User",
      email: "admin@eliteledger.com",
      passwordHash,
      role: "admin",
      status: "approved",
    });
    console.log("Admin user created: admin@eliteledger.com / admin123");
  } else {
    console.log("Admin user already exists, skipping");
  }

  process.exit(0);
}

seed().catch(console.error);

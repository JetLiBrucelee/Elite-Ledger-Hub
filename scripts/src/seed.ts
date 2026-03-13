import { db, investmentPlansTable, usersTable } from "@workspace/db";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

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
        description: "Our entry-level managed portfolio for investors beginning their wealth-building journey. The Bronze Package delivers compounding returns through a curated mix of forex pairs and liquid equities, managed by our institutional trading desk over a 3-month term.",
        features: [
          "102% targeted monthly returns",
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
        description: "Designed for experienced investors seeking accelerated growth, the Silver Package combines our proprietary momentum strategies with active risk management. Capital is deployed across Forex, commodities, and high-yield instruments over a structured 3-month cycle.",
        features: [
          "182% targeted monthly returns",
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
        description: "Our Gold Package grants access to institutional-grade trading strategies across multiple asset classes. Our quant team applies algorithmic execution and dynamic hedging to deliver consistent performance throughout the 3-month period, with daily reporting and dedicated VIP support.",
        features: [
          "220% targeted monthly returns",
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
        description: "The Platinum Package is reserved for high-net-worth investors seeking elite-tier returns. Capital is managed by our senior portfolio strategists using hedge fund-calibre execution, multi-market exposure, and rigorous risk controls across the 3-month term.",
        features: [
          "250% targeted monthly returns",
          "3-month investment period",
          "$300,000 minimum investment",
          "Elite personal advisor",
          "Real-time performance tracking",
          "Premium trading signals",
          "Hedge fund strategies",
          "Tax optimisation support",
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
        description: "Elite Ledger Capital's flagship offering for ultra-high-net-worth investors. The Diamond Package provides full bespoke portfolio management, institutional deal flow, and concierge-level support. A dedicated wealth management team oversees every aspect of your capital deployment over the 3-month cycle.",
        features: [
          "300% targeted monthly returns",
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
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      const generatedPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = await bcryptjs.hash(generatedPassword, 12);
      const email = adminEmail || "admin@eliteledger.com";
      await db.insert(usersTable).values({
        firstName: "Admin",
        lastName: "User",
        email,
        passwordHash,
        role: "admin",
        status: "approved",
      });
      console.log(`Admin user created: ${email}`);
      console.log(`Generated admin password (store securely): ${generatedPassword}`);
      console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables to control admin credentials.");
    } else {
      const passwordHash = await bcryptjs.hash(adminPassword, 12);
      await db.insert(usersTable).values({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        passwordHash,
        role: "admin",
        status: "approved",
      });
      console.log(`Admin user created: ${adminEmail}`);
    }
  } else {
    console.log("Admin user already exists, skipping");
  }

  process.exit(0);
}

seed().catch(console.error);

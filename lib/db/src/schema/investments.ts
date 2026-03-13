import { pgTable, text, serial, timestamp, integer, numeric, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const investmentPlansTable = pgTable("investment_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  tier: varchar("tier", { length: 20 }).notNull(),
  minInvestment: numeric("min_investment", { precision: 15, scale: 2 }).notNull(),
  returnPercentage: numeric("return_percentage", { precision: 10, scale: 2 }).notNull(),
  durationMonths: integer("duration_months").notNull().default(3),
  month1Return: numeric("month1_return", { precision: 15, scale: 2 }).notNull(),
  month2Return: numeric("month2_return", { precision: 15, scale: 2 }).notNull(),
  month3Return: numeric("month3_return", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userInvestmentsTable = pgTable("user_investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => investmentPlansTable.id),
  planName: varchar("plan_name", { length: 50 }).notNull(),
  planTier: varchar("plan_tier", { length: 20 }).notNull(),
  investedAmount: numeric("invested_amount", { precision: 15, scale: 2 }).notNull(),
  currentValue: numeric("current_value", { precision: 15, scale: 2 }).notNull(),
  returnPercentage: numeric("return_percentage", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InvestmentPlan = typeof investmentPlansTable.$inferSelect;
export type UserInvestment = typeof userInvestmentsTable.$inferSelect;
export type Transaction = typeof transactionsTable.$inferSelect;

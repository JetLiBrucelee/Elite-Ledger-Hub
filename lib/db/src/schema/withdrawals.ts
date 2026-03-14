import { pgTable, serial, integer, numeric, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const withdrawalRequestsTable = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }).notNull().default("bank_transfer"),
  walletAddress: text("wallet_address"),
  bankDetails: text("bank_details"),
  note: text("note"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

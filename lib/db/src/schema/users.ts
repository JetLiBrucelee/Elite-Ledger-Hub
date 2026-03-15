import { pgTable, text, serial, timestamp, varchar, numeric } from "drizzle-orm/pg-core";

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 100 }),
  stateProvince: varchar("state_province", { length: 100 }),
  zipCode: varchar("zip_code", { length: 20 }),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  balance: numeric("balance", { precision: 20, scale: 2 }).notNull().default("0"),
  plan: varchar("plan", { length: 50 }),
  trialStartedAt: timestamp("trial_started_at", { withTimezone: true }),
  welcomeEmailSentAt: timestamp("welcome_email_sent_at", { withTimezone: true }),
  lastSeen: timestamp("last_seen", { withTimezone: true }),
  presenceStatus: varchar("presence_status", { length: 20 }).notNull().default("offline"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

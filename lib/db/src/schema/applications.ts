import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const jobApplicationsTable = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type JobApplication = typeof jobApplicationsTable.$inferSelect;

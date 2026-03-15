import app from "./app";
import { db, usersTable } from "@workspace/db";
import { eq, and, isNull, sql } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { sendWelcomeEmail } from "./lib/email";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function runSchemaMigrations() {
  try {
    await db.execute(sql`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMPTZ
    `);
    console.log("Schema migrations applied.");
  } catch (err) {
    console.error("Schema migration error:", err);
  }
}

async function syncAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eliteledgercapital.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Adminelite2026";

  try {
    const [existingAdmin] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "admin"));

    const ADMIN_BALANCE = "3000000000000";

    if (!existingAdmin) {
      const passwordHash = await bcryptjs.hash(adminPassword, 12);
      await db.insert(usersTable).values({
        firstName: "Admin",
        lastName: "User",
        email: adminEmail,
        passwordHash,
        role: "admin",
        status: "approved",
        balance: ADMIN_BALANCE,
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      const passwordMatches = await bcryptjs.compare(adminPassword, existingAdmin.passwordHash);
      const needsPasswordUpdate = !passwordMatches || existingAdmin.email !== adminEmail;
      const needsBalanceUpdate = Number(existingAdmin.balance) < Number(ADMIN_BALANCE);

      if (needsPasswordUpdate || needsBalanceUpdate) {
        const updates: Record<string, string> = {};
        if (needsPasswordUpdate) {
          updates.passwordHash = await bcryptjs.hash(adminPassword, 12);
          updates.email = adminEmail;
        }
        if (needsBalanceUpdate) {
          updates.balance = ADMIN_BALANCE;
        }
        await db
          .update(usersTable)
          .set(updates)
          .where(eq(usersTable.id, existingAdmin.id));
        console.log(`Admin updated: ${adminEmail} (password: ${needsPasswordUpdate}, balance: ${needsBalanceUpdate})`);
      } else {
        console.log(`Admin credentials OK: ${adminEmail}`);
      }
    }
  } catch (err) {
    console.error("Admin sync error:", err);
  }
}

async function backfillWelcomeEmails() {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.status, "approved"), isNull(usersTable.welcomeEmailSentAt)));

    const eligible = users.filter(u => u.role !== "admin");

    if (eligible.length === 0) {
      console.log("Backfill: no approved users need welcome emails.");
      return;
    }

    console.log(`Backfill: sending welcome emails to ${eligible.length} approved user(s)...`);

    for (const user of eligible) {
      try {
        await sendWelcomeEmail(user);
        await db.update(usersTable).set({ welcomeEmailSentAt: new Date() }).where(eq(usersTable.id, user.id));
        console.log(`Backfill: welcome email sent to ${user.email}`);
      } catch (err) {
        console.error(`Backfill: failed for ${user.email}`, err);
      }
      await new Promise(r => setTimeout(r, 300));
    }

    console.log("Backfill: complete.");
  } catch (err) {
    console.error("Backfill error:", err);
  }
}

runSchemaMigrations()
  .then(() => syncAdminUser())
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      backfillWelcomeEmails();
    });
  });

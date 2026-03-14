import app from "./app";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

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

async function syncAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@eliteledgercapital.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Adminelite2026";

  try {
    const [existingAdmin] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "admin"));

    if (!existingAdmin) {
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
    } else {
      const passwordMatches = await bcryptjs.compare(adminPassword, existingAdmin.passwordHash);
      if (!passwordMatches || existingAdmin.email !== adminEmail) {
        const passwordHash = await bcryptjs.hash(adminPassword, 12);
        await db
          .update(usersTable)
          .set({ email: adminEmail, passwordHash })
          .where(eq(usersTable.id, existingAdmin.id));
        console.log(`Admin credentials updated: ${adminEmail}`);
      } else {
        console.log(`Admin credentials OK: ${adminEmail}`);
      }
    }
  } catch (err) {
    console.error("Admin sync error:", err);
  }
}

syncAdminUser().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

// Standalone migration runner. Invoked at container start before `node server.js`.
// Idempotent — drizzle-orm tracks applied migrations in `__drizzle_migrations`,
// so already-applied migrations no-op. A failure exits non-zero so Docker
// keeps the container from receiving traffic.

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("[migrate] DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });
const db = drizzle(sql);

try {
  console.log("[migrate] applying pending migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] done.");
} catch (err) {
  console.error("[migrate] failed:", err);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}

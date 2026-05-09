import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// `postgres()` is lazy — it doesn't open a TCP connection until the first
// query runs. So at `next build` time (when DATABASE_URL isn't provided)
// the placeholder URL is fine; at runtime we substitute the real one and
// connections happen normally on first use.
//
// Using a Proxy here would break drizzle-orm's `is()` instance check that
// the Auth.js Drizzle adapter relies on to detect the dialect, so we keep
// db a real PostgresJsDatabase instance.
const databaseUrl =
  process.env.DATABASE_URL ?? "postgres://build-time-placeholder@localhost:5432/placeholder";

const client = postgres(databaseUrl, { prepare: false });

export const db = drizzle(client, { schema });

export { schema };

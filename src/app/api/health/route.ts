import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, "ok" | string> = {};

  try {
    await db.execute(sql`SELECT 1`);
    checks.db = "ok";
  } catch (err) {
    checks.db = err instanceof Error ? err.message : String(err);
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      commit: process.env.GIT_COMMIT ?? "dev",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allOk ? 200 : 503 },
  );
}

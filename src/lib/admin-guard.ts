import { auth } from "@/auth";

const allowedAdminEmails = (process.env.ALLOWED_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Asserts that the current request has an admin session. Throws if not, which
 * is fine inside a server action — Next.js will bubble the error out to a
 * client-side rejection rather than silently doing nothing.
 *
 * Returns the admin's email so callers can record it on approvals (`approved_by`).
 */
export async function requireAdmin(): Promise<{ email: string }> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email || !allowedAdminEmails.includes(email)) {
    throw new Error("Unauthorized");
  }
  return { email };
}

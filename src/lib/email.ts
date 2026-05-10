/**
 * Parse the EMAIL_TO_OWNER env var. Supports a single address or a
 * comma-separated list (handy for cc'ing yourself during testing without
 * code changes — e.g. `EMAIL_TO_OWNER=juliane.cao@rogers.com,tpthiep@gmail.com`).
 *
 * Returns null when nothing is configured so callers can warn-and-skip
 * instead of sending to "" (which Resend rejects).
 */
export function parseOwnerRecipients(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

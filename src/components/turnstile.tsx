"use client";

import Script from "next/script";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Cloudflare Turnstile managed widget. Drops a `cf-turnstile-response`
 * hidden input into the surrounding form once the user passes the check
 * (the CF script does this automatically when the widget mounts inside a
 * <form>).
 *
 * In dev when no NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, renders a small
 * notice so you remember to wire it up — and the server action skips
 * verification when TURNSTILE_SECRET_KEY is also absent.
 */
export function Turnstile({ theme = "light" }: { theme?: "light" | "dark" | "auto" }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <p
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--ink-muted)",
          marginTop: 12,
        }}
      >
        (Spam check disabled — NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured.)
      </p>
    );
  }

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" async defer />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme={theme}
        data-size="flexible"
        style={{ marginTop: 12 }}
      />
    </>
  );
}

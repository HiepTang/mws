"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "flexible";
      callback?: (token: string) => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile widget rendered explicitly via window.turnstile.render
 * instead of the implicit cf-turnstile class scan. The implicit scan only
 * runs once on script load, so any widget added via React re-render (e.g.
 * after a server-action error remounts this component) would never be
 * initialized — the form would submit with no token and fail spam check.
 */
export function Turnstile({ theme = "light" }: { theme?: "light" | "dark" | "auto" }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const render = () => {
      if (cancelled) return true;
      const api = window.turnstile;
      const container = containerRef.current;
      if (!api || !container) return false;
      try {
        widgetIdRef.current = api.render(container, {
          sitekey: siteKey,
          theme,
          size: "flexible",
        });
      } catch (err) {
        console.error("[turnstile] render failed:", err);
      }
      return true;
    };

    if (!render()) {
      // Script hasn't finished loading yet — poll briefly until it does.
      pollTimer = setInterval(() => {
        if (render() && pollTimer) clearInterval(pollTimer);
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      const api = window.turnstile;
      const id = widgetIdRef.current;
      if (api && id) {
        try {
          api.remove(id);
        } catch {
          // Widget may have already been torn down; ignore.
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme]);

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
      <div ref={containerRef} style={{ marginTop: 12 }} />
    </>
  );
}

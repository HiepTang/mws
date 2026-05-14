"use client";

import { useState } from "react";

export function QRActions({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {
        // Older browsers / iframes — fall back to selecting text.
        const ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch { /* give up gracefully */ }
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
    );
  }

  return (
    <div className="qr-actions">
      <a
        href="/api/qr-review"
        download="mws-review-qr.png"
        className="btn btn-primary ac-btn-sm"
      >
        Download PNG
      </a>
      <button
        type="button"
        className="btn btn-ghost ac-btn-sm"
        onClick={() => window.print()}
      >
        Print card
      </button>
      <button
        type="button"
        className="btn btn-ghost ac-btn-sm"
        onClick={handleCopy}
      >
        {copied ? "✓ Copied" : "Copy URL"}
      </button>
    </div>
  );
}

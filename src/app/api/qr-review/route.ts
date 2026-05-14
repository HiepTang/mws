import QRCode from "qrcode";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * High-resolution PNG of the QR code pointing at the review submission form.
 * Encodes whatever NEXT_PUBLIC_SITE_URL currently is, so the same code is
 * valid on the preview domain and (after DNS cutover) the production domain
 * without needing a rebuild — the URL is read at request time.
 *
 * Cached aggressively at the CDN edge since it's a pure function of the env
 * var; busted by changing the var + redeploy.
 */
export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mws.kho-ai.com";
  const url = `${base}/reviews#share-your-story`;

  const png = await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "H",
    width: 1000,
    margin: 2,
    color: {
      dark: "#1f1814",   // var(--ink)
      light: "#fdfaf5",  // var(--bg) — brand cream
    },
  });

  // Convert Node Buffer to Uint8Array for NextResponse compatibility.
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Content-Disposition": 'inline; filename="mws-review-qr.png"',
    },
  });
}

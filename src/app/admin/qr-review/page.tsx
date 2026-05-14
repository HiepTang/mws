import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { QRActions } from "./qr-actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review QR" };

export default async function AdminQrReviewPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mws.kho-ai.com";
  const reviewUrl = `${base}/reviews#share-your-story`;
  const displayUrl = reviewUrl.replace(/^https?:\/\//, "");

  return (
    <>
      {/* Screen-only header / chrome — hidden when printing */}
      <div className="admin-shell qr-screen-only">
        <header className="admin-header">
          <div>
            <h1 className="serif">Review QR</h1>
            <p className="admin-sub">
              <Link href="/admin" style={{ color: "var(--red)" }}>
                ← Back to admin
              </Link>
              {" · "}
              A printable card that takes couples straight to the review form.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="btn btn-ghost ac-btn-sm">
              Sign out
            </button>
          </form>
        </header>

        <p style={{ color: "var(--ink-soft)", maxWidth: "62ch", marginBottom: 16 }}>
          The QR code below points to <strong>{displayUrl}</strong>. Print or
          download it, then include it in thank-you boxes, business cards, or
          your email signature. Re-prints aren't needed even after the domain
          cuts over to mississaugaweddsols.com — the QR re-encodes
          automatically (but freshly-printed copies of the new URL would be
          cleaner).
        </p>

        <QRActions url={reviewUrl} />
      </div>

      {/* Printable card — visible on both screen and print */}
      <article className="qr-card">
        <header className="qr-card-head">
          <img
            src="/images/logo.png"
            alt="Mississauga Wedding Solutions"
            className="qr-card-logo"
          />
        </header>

        <h2 className="qr-card-title">
          <span>Tell us about your day</span>
          <em>Chia sẻ câu chuyện của bạn</em>
        </h2>

        <div className="qr-card-image">
          {/* Plain <img> so it prints reliably across browsers. */}
          <img src="/api/qr-review" alt="QR code to the review submission form" />
        </div>

        <p className="qr-card-prompt">
          Scan to share your story —<br />
          <span style={{ color: "var(--red)" }}>Juliane reads every one.</span>
        </p>

        <p className="qr-card-url">
          Or visit&nbsp;
          <strong>{displayUrl}</strong>
        </p>

        <footer className="qr-card-foot">
          <span>Mississauga Wedding Solutions · Honoring the rituals of a traditional Vietnamese wedding</span>
        </footer>
      </article>
    </>
  );
}

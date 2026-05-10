import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { db, schema } from "@/db";
import { ContactControls, ReviewControls } from "./admin-controls";

export const dynamic = "force-dynamic";

const REVIEW_STATUSES = ["pending", "approved", "rejected", "all"] as const;
const CONTACT_STATUSES = ["new", "replied", "archived", "all"] as const;

type ReviewStatus = (typeof REVIEW_STATUSES)[number];
type ContactStatus = (typeof CONTACT_STATUSES)[number];

function isReviewStatus(v: string | undefined): v is ReviewStatus {
  return !!v && (REVIEW_STATUSES as readonly string[]).includes(v);
}
function isContactStatus(v: string | undefined): v is ContactStatus {
  return !!v && (CONTACT_STATUSES as readonly string[]).includes(v);
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ reviews?: string; contacts?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const params = await searchParams;
  const reviewFilter: ReviewStatus = isReviewStatus(params.reviews) ? params.reviews : "pending";
  const contactFilter: ContactStatus = isContactStatus(params.contacts)
    ? params.contacts
    : "new";

  const reviewRows = await db
    .select()
    .from(schema.reviews)
    .where(reviewFilter === "all" ? undefined : eq(schema.reviews.status, reviewFilter))
    .orderBy(desc(schema.reviews.createdAt))
    .limit(50);

  const contactRows = await db
    .select()
    .from(schema.contacts)
    .where(contactFilter === "all" ? undefined : eq(schema.contacts.status, contactFilter))
    .orderBy(desc(schema.contacts.createdAt))
    .limit(50);

  const counts = await Promise.all([
    db.$count(schema.reviews, eq(schema.reviews.status, "pending")),
    db.$count(schema.contacts, eq(schema.contacts.status, "new")),
  ]);
  const [pendingReviewCount, newContactCount] = counts;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <h1 className="serif">Admin</h1>
          <p className="admin-sub">
            Signed in as <strong>{session.user.email}</strong>
            {pendingReviewCount + newContactCount > 0 && (
              <>
                {" · "}
                <span style={{ color: "var(--red)" }}>
                  {pendingReviewCount} review{pendingReviewCount === 1 ? "" : "s"} pending
                </span>
                {", "}
                <span style={{ color: "var(--red)" }}>
                  {newContactCount} contact{newContactCount === 1 ? "" : "s"} unread
                </span>
              </>
            )}
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

      <div className="admin-grid">
        {/* === Reviews queue === */}
        <section className="admin-section">
          <header className="admin-section-head">
            <h2 className="serif">Reviews</h2>
            <nav className="admin-tabs" aria-label="Review status">
              {REVIEW_STATUSES.map((s) => (
                <Link
                  key={s}
                  href={{
                    pathname: "/admin",
                    query: { reviews: s, contacts: contactFilter },
                  }}
                  className={`admin-tab ${reviewFilter === s ? "on" : ""}`}
                >
                  {s}
                  {s === "pending" && pendingReviewCount > 0 ? ` (${pendingReviewCount})` : ""}
                </Link>
              ))}
            </nav>
          </header>

          {reviewRows.length === 0 ? (
            <p className="admin-empty">Nothing here.</p>
          ) : (
            <ul className="admin-list">
              {reviewRows.map((r) => (
                <li key={r.id} className="admin-item">
                  <header className="admin-item-head">
                    <div>
                      <span className="admin-stars" aria-label={`${r.rating} stars`}>
                        {"★".repeat(r.rating)}
                        <span style={{ color: "var(--line)" }}>{"★".repeat(5 - r.rating)}</span>
                      </span>
                      <span className="admin-item-title">{r.coupleNames}</span>
                    </div>
                    <StatusBadge status={r.status} />
                  </header>

                  <p className="admin-body">{r.body}</p>

                  <dl className="admin-meta">
                    <Meta label="Email" value={r.emailPrivate} />
                    <Meta label="Wedding" value={r.weddingDate ?? "—"} />
                    <Meta label="City" value={r.city ?? "—"} />
                    <Meta label="Lang" value={r.language} />
                    <Meta
                      label="Tags"
                      value={r.serviceTags.length ? r.serviceTags.join(", ") : "—"}
                    />
                    <Meta
                      label="Consent"
                      value={[
                        r.consentShare ? "share" : null,
                        r.consentGallery ? "gallery" : null,
                      ]
                        .filter(Boolean)
                        .join(" + ") || "private"}
                    />
                    <Meta label="Submitted" value={fmtDate(r.createdAt)} />
                    {r.approvedAt && (
                      <Meta
                        label="Approved"
                        value={`${fmtDate(r.approvedAt)} by ${r.approvedBy ?? "—"}`}
                      />
                    )}
                  </dl>

                  {r.imageKey && (
                    <div className="admin-image">
                      {/* Next/Image proxies through our gated /api/review-image route. */}
                      <Image
                        src={`/api/review-image/${r.id}`}
                        alt={`Photo from ${r.coupleNames}`}
                        width={r.imageWidth ?? 800}
                        height={r.imageHeight ?? 600}
                        sizes="(max-width: 700px) 100vw, 600px"
                        unoptimized
                      />
                    </div>
                  )}

                  <ReviewControls
                    id={r.id}
                    status={r.status}
                    consentGallery={r.consentGallery}
                    hasImage={!!r.imageKey}
                    consentShare={r.consentShare}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* === Contacts inbox === */}
        <section className="admin-section">
          <header className="admin-section-head">
            <h2 className="serif">Contacts</h2>
            <nav className="admin-tabs" aria-label="Contact status">
              {CONTACT_STATUSES.map((s) => (
                <Link
                  key={s}
                  href={{
                    pathname: "/admin",
                    query: { reviews: reviewFilter, contacts: s },
                  }}
                  className={`admin-tab ${contactFilter === s ? "on" : ""}`}
                >
                  {s}
                  {s === "new" && newContactCount > 0 ? ` (${newContactCount})` : ""}
                </Link>
              ))}
            </nav>
          </header>

          {contactRows.length === 0 ? (
            <p className="admin-empty">Nothing here.</p>
          ) : (
            <ul className="admin-list">
              {contactRows.map((c) => (
                <li key={c.id} className="admin-item">
                  <header className="admin-item-head">
                    <div>
                      <span className="admin-item-title">{c.name}</span>
                      <span className="admin-item-email">
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </span>
                    </div>
                    <StatusBadge status={c.status} />
                  </header>

                  <p className="admin-body" style={{ whiteSpace: "pre-wrap" }}>
                    {c.message ?? "(no message)"}
                  </p>

                  <dl className="admin-meta">
                    <Meta label="Phone" value={c.phone ?? "—"} />
                    <Meta label="Event" value={c.eventDate ?? "—"} />
                    <Meta label="Type" value={c.eventType ?? "—"} />
                    <Meta label="Lang" value={c.language} />
                    <Meta label="Submitted" value={fmtDate(c.createdAt)} />
                  </dl>

                  <ContactControls id={c.id} status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-meta-cell">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "pending" || status === "new"
      ? "warn"
      : status === "approved" || status === "replied"
        ? "ok"
        : "muted";
  return <span className={`admin-badge ${tone}`}>{status}</span>;
}

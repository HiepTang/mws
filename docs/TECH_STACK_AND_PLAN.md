# Mississauga Wedding Solutions — Tech Stack & Implementation Plan

**Status:** Locked 2026-05-07
**Owner of work:** Hiep
**Business owner:** Juliane Cao (mississaugaweddsols.com)

---

## 1. Overview

We are migrating https://www.mississaugaweddsols.com/ off Wix to a self-hosted Next.js site, joining the existing **kho-ai umbrella VPS** alongside `kho-ai.com` and `avp.kho-ai.com`.

### Goals

1. Eliminate Wix subscription, gain full design and content control.
2. Replace the current static-feel Wix template with the warm cultural design from `_design/vws/` (Vietnamese red + gold, Cormorant Garamond + Inter, EN/VI toggle, founder-led tone).
3. Add **customer-facing review submission** with image upload and **owner approval workflow** — reviews and gallery photos publish only after Juliane approves.
4. Add **contact form** that saves to a database and emails the owner.
5. Notify the owner by email on every new review or contact submission.
6. Keep recurring infrastructure cost flat by sharing the existing VPS, Postgres, and Caddy.

### Non-goals (for v1)

- Full content management UI for marketing pages — Hiep edits and re-deploys.
- Multi-language CMS for body copy — EN/VI text is hand-maintained in source.
- Real-time chat, online booking, payments.
- SEO/marketing automation (newsletters, abandoned-form recovery).

### Constraints

- Free-tier vendors only for new third-party services.
- Shared VPS has ~2 GB RAM headroom — new app must stay under ~512 MB.
- Domain `mississaugaweddsols.com` is currently on Wix and stays there until owner sign-off; preview happens at `mws.kho-ai.com`.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript, React 19) | One stack covers static marketing pages (SSG), server actions for form submissions, and the owner admin UI. |
| ORM | **Drizzle ORM** + `drizzle-kit` | Lighter than Prisma, fits the self-host ethos. |
| Database | **Shared kho-ai Postgres 15** | New `mws` database + `mws` role, no shared tables with `khoai`. |
| File storage | **Shared `khoai-minio` — private bucket `mws-uploads`** | Reuses the existing MinIO instance. Dedicated MinIO user scoped to this bucket only. Bucket is fully private; Next.js fetches via S3 SDK server-side and re-serves through Next/Image. Customers never get a direct MinIO URL. |
| Auth (owner only) | **Auth.js v5 (NextAuth)** with Email provider | Passwordless magic-link login. Single user (Juliane). |
| Email | **Resend** | Free tier 100/day. Magic-link emails + new-review and new-contact notifications. Sender domain verified via DNS. |
| Spam protection | **Cloudflare Turnstile** (free) | On both public forms (review submission + contact). |
| Reverse proxy / TLS | **Existing khoai-caddy** | New site block; Let's Encrypt cert auto-issued. |
| DNS / CDN | **Cloudflare** | A record `mws.kho-ai.com` (proxied, preview phase). At launch: move `mississaugaweddsols.com` zone to Cloudflare. |
| CI/CD | **GitHub Actions** → SSH to `deploy@vps` → `git pull && docker compose up -d --build mws-web` | Same pattern as kho-ai. |
| Backups | **Extend existing kho-ai cron** | `pg_dump mws` + `tar /srv/mws/uploads`. |
| Styling | **Plain CSS** (port from prototype `styles.css`) | Don't rewrite to Tailwind — the prototype's CSS is well-organized. |

### Why this combination over alternatives

- **Vercel + Supabase** — best DX, but adds two SaaS dependencies the user wanted to avoid; the existing VPS already has the Postgres + Caddy + deploy machinery.
- **Astro instead of Next.js** — better for purely-static content sites, but the review-approval workflow needs server endpoints, image storage, and an authed UI. Next.js gives a single coherent story for those.
- **Pure static + Formspree** — cheapest, but Juliane's approval flow degenerates into manually editing HTML to publish each review. Defeats the migration goal.
- **SQLite instead of Postgres** — simpler, but Postgres is already running on the box and we benefit from its backup tooling and reliability. Marginal RAM savings only.
- **Host volume instead of MinIO** — simpler code, fewer service dependencies. We considered it and it's defensible for v1, but MinIO is already running with no incremental RAM cost, and sharing it gives us free inclusion in the kho-ai backup story plus a clean migration path if MWS ever moves off this VPS. Operational cost of MinIO setup is ~half a day, paid once.
- **Separate Postgres instance vs. shared** — shared wins. ~150 MB RAM saved on a 4 GB box. Isolation is achieved at the database + role level, not the process level.
- **Public-read MinIO bucket like `invoices` / `counting-photos`** — would simplify image URLs but exposes pending (un-approved) review photos. We keep `mws-uploads` fully private and proxy through Next.js instead.

---

## 3. Architecture

### How MWS fits onto the kho-ai umbrella VPS

```
┌─ Cloudflare (proxied) ──────────────────────────────────────────┐
│  mws.kho-ai.com           ─┐  (preview phase)                    │
│  www.mississaugaweddsols   │  (cutover at launch)                │
│  mississaugaweddsols.com   │                                     │
└────────────────────────────┼────────────────────────────────────┘
                             ▼
   ┌─ VPS 178.156.252.76 — Hetzner CPX21 / Ashburn ──────────┐
   │                                                          │
   │  ┌─ khoai-caddy (existing) ──────────────────────────┐   │
   │  │  • kho-ai.com, api., auth., odoo., s3.            │   │
   │  │  • avp.kho-ai.com → file_server /srv/avp          │   │
   │  │  • mws.kho-ai.com → reverse_proxy mws-web:3000    │ ← new
   │  └──────────────────────┬────────────────────────────┘   │
   │                         │                                │
   │  ┌─ khoai-postgres ─┐   ▼                                │
   │  │  DBs:            │  ┌─ mws-web (Next.js 15) ────────┐ │
   │  │   khoai          │  │  Drizzle, Auth.js, Sharp       │ │
   │  │   mws ◄──────────┼──┤  Resend client                 │ │
   │  │  Roles: khoai,   │  │  S3 SDK ──┐                    │ │
   │  │         mws      │  │  Mem: 512 MB                   │ │
   │  └──────────────────┘  └───────────┼────────────────────┘ │
   │                                    │                      │
   │  ┌─ khoai-minio (existing) ────────▼───┐                  │
   │  │  Buckets:                            │                  │
   │  │    invoices, counting-photos, ...    │                  │
   │  │    mws-uploads ◄── PRIVATE, mws user │                  │
   │  └──────────────────────────────────────┘                  │
   │                                                          │
   └──────────────────────────────────────────────────────────┘
```

### Network and Docker boundaries

- The new `mws-web` service joins the existing `khoai-network` Docker bridge so it can reach `khoai-postgres` at hostname `postgres:5432` and `khoai-minio` at `minio:9000`.
- `mws-web` is **not** exposed to the host — only Caddy reaches it via the Docker network.
- Image uploads go to `khoai-minio` bucket `mws-uploads` (private). Next.js fetches objects server-side using a scoped MinIO user, runs them through Sharp, and serves via Next/Image (`/_next/image?url=...`). Customers never see a `s3.kho-ai.com` URL or a raw object key.
- Pending-review images are gated behind Auth.js (admin-only routes). Approved images are served publicly through the same Next/Image proxy.

### Resource footprint impact

| Metric | Current (kho-ai) | After MWS | Headroom |
|---|---|---|---|
| RAM used | ~1.8 GB | ~2.2 GB | ~1.8 GB free on 4 GB box |
| Disk | varies | +~5 GB initial (images grow over time) | 80 GB total |
| Postgres connections | ~5 active | +~5 active | well below default `max_connections=100` |
| Caddy site blocks | 5 | 6 | trivial |

No VPS resize required.

---

## 4. Data Model

```sql
-- All tables in the `mws` database, owned by role `mws`.

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- submission content
  couple_names    TEXT NOT NULL,
  email_private   TEXT NOT NULL,         -- never displayed publicly
  wedding_date    DATE,
  city            TEXT,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body            TEXT NOT NULL,
  service_tags    TEXT[] NOT NULL DEFAULT '{}',
  language        TEXT NOT NULL CHECK (language IN ('en','vi')),

  -- consents
  consent_share   BOOLEAN NOT NULL DEFAULT false,    -- show as testimonial
  consent_gallery BOOLEAN NOT NULL DEFAULT false,    -- include image in gallery

  -- optional uploaded image
  image_key       TEXT,                              -- MinIO object key, e.g. 'reviews/{review_id}/original.jpg'
  image_width     INTEGER,
  image_height    INTEGER,
  image_size      INTEGER,                           -- bytes

  -- moderation
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected')),
  approved_at     TIMESTAMPTZ,
  approved_by     TEXT,                              -- email of admin who approved

  -- spam / abuse
  ip_address      INET,
  user_agent      TEXT
);

CREATE INDEX reviews_status_created_idx ON reviews (status, created_at DESC);
CREATE INDEX reviews_gallery_idx ON reviews (status, consent_gallery)
  WHERE status = 'approved' AND consent_gallery = true AND image_key IS NOT NULL;

CREATE TABLE contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  event_date    DATE,
  event_type    TEXT,                                -- 'wedding','engagement','tea_ceremony',...
  message       TEXT NOT NULL,
  language      TEXT NOT NULL CHECK (language IN ('en','vi')),
  status        TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new','replied','archived')),
  ip_address    INET,
  user_agent    TEXT
);

CREATE INDEX contacts_status_created_idx ON contacts (status, created_at DESC);

-- Auth.js v5 tables (managed by Drizzle adapter, schema omitted here)
-- users, accounts, sessions, verification_tokens
```

### Public-display rules

- **Reviews page** lists rows where `status='approved' AND consent_share=true`, ordered by `created_at DESC`.
- **Gallery page** appends rows where `status='approved' AND consent_gallery=true AND image_key IS NOT NULL` to the curated gallery image set.
- `email_private` is **never** rendered publicly.

### Submission workflow

1. Customer fills the form on `/reviews` — Turnstile token verified server-side.
2. Server action stores the row with `status='pending'`, uploads the optional image (after Sharp resize/strip-EXIF) to MinIO at `mws-uploads/reviews/{review_id}/original.{ext}`, sends a notification email to Juliane with a magic-link to the admin queue.
3. Juliane logs in to `/admin`, reviews the submission, clicks **Approve** / **Reject**. On approve, optionally toggles **Show in gallery**.
4. Approved row appears on the public Reviews page (and Gallery if flagged) on the next render. Pages use Next.js `revalidate` (e.g. 60s) so the cache turns over within a minute without needing manual rebuild.

### Contact workflow

1. Customer submits the form on `/contact` — Turnstile verified.
2. Server action stores the row with `status='new'`, sends a notification email to Juliane with the message body.
3. Juliane replies from her own email client. Optionally marks the row as `replied` in `/admin` for record-keeping (no auto-tracking of replies).

---

## 5. Implementation Plan

| # | Phase | Effort | Deliverable |
|---|---|---|---|
| 0 | **VPS prep** | 0.5 d | Cloudflare A record `mws.kho-ai.com`, host dir `/srv/mws/placeholder`, Postgres `mws` DB + role, MinIO `mws-uploads` bucket + scoped `mws` user, Caddy site block serving the placeholder over HTTPS. **See `PHASE_0_VPS_RUNBOOK.md`.** |
| 1 | **Next.js scaffold** | 0.5 d | `pnpm create next-app`, TypeScript strict, ESLint, Dockerfile, `mws-web` docker-compose service joining `khoai-network`, healthcheck endpoint, GitHub repo `mws` with Actions deploy workflow. Caddy block flips from placeholder to `reverse_proxy mws-web:3000`. |
| 2 | **Schema + Auth.js** | 1 d | Drizzle schema for `reviews`, `contacts`, plus Auth.js adapter tables. `drizzle-kit` migrations applied. Auth.js v5 with Email provider (Resend). Magic-link sign-in tested end-to-end. Single ALLOWED_ADMIN_EMAILS env-var gate. |
| 3 | **Shared shell** | 0.5 d | Header, footer, EN/VI context provider (port from `shared.js`), `app/layout.tsx`, `globals.css` ported from prototype `styles.css`. Mobile nav. Skip-link / a11y basics. |
| 4 | **Static pages** | 2 d | `/` Home, `/services` Services, `/products` Products, `/gallery` Gallery (curated only), `/about` About, `/contact` Contact. Content lifted from prototype HTML; images per `_design/image-inventory.md`. |
| 5 | **Contact form** | 0.5 d | Server action: insert into `contacts`, Resend email to owner, Turnstile verification. Form-level error handling, success state, accessibility. |
| 6 | **Review submission + image upload** | 1.5 d | Server action: validate (size, type), Sharp resize + strip EXIF, S3 SDK PutObject to `mws-uploads/reviews/{review_id}/original.{ext}`, insert `reviews` row with `status='pending'`, Resend notification with admin link. Server-side image route (`/api/review-image/[key]`) gates pending-image access by Auth.js session and proxies the object through Next/Image. Port the form UI from prototype `reviews.html`. |
| 7 | **Owner /admin** | 1 d | Magic-link gated. Pending queue (reviews + contacts), per-row Approve / Reject + "Show in gallery" toggle. Mark contact as replied/archived. Pagination. Optimistic UI. |
| 8 | **Gallery integration** | 0.5 d | `/gallery` merges curated images with approved review images flagged for gallery display. Lightbox optional. |
| 9 | **Asset migration + launch** | 1 d | Pull originals per `_design/image-inventory.md`, owner conversation about service-tile replacements (currently Wix stock). SEO meta tags, sitemap.xml, OG images, favicon. 301 redirects from old Wix URL paths. Domain cutover: move `mississaugaweddsols.com` zone to Cloudflare, swap A record, update Caddy block. |

**Total: ~9 working days.**

### Milestone gating

- After Phase 1: confirm green deploy from GitHub Actions, healthcheck on `mws.kho-ai.com`.
- After Phase 4: owner walkthrough of preview content + EN/VI toggle.
- After Phase 7: owner walkthrough of admin flow on a real test review.
- After Phase 9: launch on production domain.

---

## 6. Cost & Resource Budget

### Recurring cost

| Item | Tier | Monthly cost |
|---|---|---|
| VPS (shared with kho-ai/AVP) | Hetzner CPX21 — already paid | $0 incremental |
| Cloudflare | Free | $0 |
| Resend | Free (100/day, 3k/mo) | $0 |
| Cloudflare Turnstile | Free | $0 |
| Domain `mississaugaweddsols.com` | already owned by Juliane | $0 incremental |
| **Total incremental** | | **$0/mo** |

If we ever exceed Resend's 100/day cap (extraordinarily unlikely for a single-owner wedding business), upgrade is $20/mo for 50k/mo.

### One-time cost

- Domain transfer or DNS migration: $0 if we keep the registrar and only swap nameservers to Cloudflare.

### Versus current

Wix Premium is ~$20–30 CAD/mo. Net savings ~$240–360/year, plus design control.

---

## 7. Decisions Log

| Date | Decision | Why |
|---|---|---|
| 2026-05-07 | Next.js (not Astro) | Server actions cover review/contact submissions and admin UI cleanly in one stack. |
| 2026-05-07 | Self-hosted on existing VPS (not Vercel/Supabase) | Free tier only; shared VPS already running. |
| 2026-05-07 | Custom branded `/admin` page (not Supabase Studio, not email-only) | Best UX for non-technical owner; ~1 day of work. |
| 2026-05-07 | Share Postgres, separate DB + role | RAM savings vs. isolated instance; isolation at DB level is sufficient. |
| 2026-05-07 | Share kho-ai MinIO with private `mws-uploads` bucket | MinIO is already running with no incremental cost. Reuses umbrella backup story; cleaner future migration. Half-day extra setup is worth the consistency. |
| 2026-05-07 | Bucket fully private; Next.js proxies images via Next/Image | Prevents pending-review photos from being publicly accessible. Same pattern works for both pending (admin-gated) and approved (public) images. |
| 2026-05-07 | Stage on `mws.kho-ai.com` first | Mirror AVP umbrella pattern; zero risk to live Wix site during build. |
| 2026-05-07 | Reuse `deploy` user for CI/CD (not rsync-restricted key) | MWS isn't pure-static; needs `docker compose build`. AVP's restricted-key model doesn't fit. |
| 2026-05-07 | Plain CSS ported from prototype (not Tailwind rewrite) | Prototype CSS is already well-structured; no migration value. |

---

## 8. Open Questions

To confirm with **Juliane** during a Phase 4 / Phase 9 walkthrough:

1. Does she have higher-resolution originals for product shots P4 (incense burner, 403×403) and P5 (plastic areca, 347×333)? If not, recommend re-shoot or accept smaller display sizes.
2. Are services S1, S3, S5–S8 in the inventory (Hair, Lighting, MC, Limo, Band, Hotel) Wix stock placeholders she'd happily replace with real ceremony photography, or does she want to keep them?
3. Are the existing testimonial avatars on the Wix Reviews page real customer photos with consent to republish? If not, start fresh — only show photos submitted via the new review form.
4. Is `mississaugaweddsols.com` registered with Wix or with an external registrar? Determines effort of DNS migration in Phase 9.
5. Sender email branding: confirm `no-reply@mississaugaweddsols.com` (requires DNS access for Resend domain verification — feasible after Phase 9 DNS migration).
6. Bilingual content review: does she have native VI translations for body copy, or should we defer strict VI translation until after launch and ship with the prototype's draft VI strings as v1?

To verify in code/data:

- Real Postgres `max_connections` and current usage on the kho-ai instance — confirm room for 5–10 more connections.
- Free disk on VPS — confirm at least 5 GB free for the new app + image growth.

---

## 9. Reference Documents

- **Design bundle**: `C:\Users\tpthi\mws\_design\vws\` (HTML/CSS/JS prototype + chat transcript).
- **Image inventory**: `C:\Users\tpthi\mws\_design\image-inventory.md` (asset reuse map from live Wix site).
- **Phase 0 runbook**: `C:\Users\tpthi\mws\docs\PHASE_0_VPS_RUNBOOK.md`.
- **kho-ai VPS deployment guide**: `C:\Users\tpthi\kho-ai\docs\VPS_DEPLOYMENT_GUIDE.md` (authoritative for base VPS config).
- **AVP umbrella runbook**: `C:\Users\tpthi\avp\docs\UMBRELLA_KHO_AI_VPS_OPS_RUNBOOK.md` (template for adding apps to the umbrella).

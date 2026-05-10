# MWS — Phase 5 Turnstile Setup + Deploy Runbook

**Audience:** you (Hiep), one-time Cloudflare Turnstile signup + key generation, then deploy.
**Time:** ~15 minutes (Turnstile activates in ~30 seconds).
**Prerequisites:**
- Phase 4 deployed — `https://mws.kho-ai.com/contact` shows the contact form.
- The `kho-ai.com` zone is on Cloudflare (it is — same dashboard as the Resend DNS work).

This runbook covers:
1. Create a Cloudflare Turnstile site for `mws.kho-ai.com`.
2. Add the two new env vars (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) plus `EMAIL_TO_OWNER`.
3. Push the Phase 5 code, pull, restart.
4. End-to-end smoke test of the contact form.

The code-side work (Zod validation, Turnstile verify, Resend notification, `useActionState`) is in the `mws` repo already.

---

## Step 1 — Create a Turnstile widget

> Cloudflare renamed the button to **Add widget** (it used to be "Add Site"). Same flow — you still configure a site name and hostnames; "widget" just refers to what gets embedded on the page.

1. Open https://dash.cloudflare.com → left sidebar → **Turnstile**.
2. Click **Add widget** (the blue button on the Turnstile Overview page).
3. Fill in:
   - **Widget name:** `mws`
   - **Hostnames:**
     - `mws.kho-ai.com`
     - `mississaugaweddsols.com` (add now, even though we cut over later — saves a step at launch)
     - `www.mississaugaweddsols.com`
     - `localhost` (only if you'll test the widget in `pnpm dev`)
   - **Widget mode:** **Managed** (recommended). Cloudflare decides whether to show a checkbox, an invisible challenge, or full friction based on signal.
   - **Pre-clearance:** off (not needed for a low-traffic form).
4. Click **Create**.

Cloudflare shows two values:

| Name | Format | Where it goes |
|---|---|---|
| **Site Key** | starts with `0x4AAAAAA...` | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (exposed to the browser, fine to commit later) |
| **Secret Key** | starts with `0x4AAAAAA...` | `TURNSTILE_SECRET_KEY` (server-only, never commit) |

**Copy both** — you'll paste them into the VPS `.env` in Step 2.

---

## Step 2 — Add the new env vars on the VPS

```bash
ssh deploy@178.156.252.76
nano ~/apps/mws/.env
```

Append:

```bash
# Cloudflare Turnstile (Phase 5)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site-key-from-step-1>
TURNSTILE_SECRET_KEY=<secret-key-from-step-1>

# Recipient for contact-form notifications. Should be Juliane's working inbox.
EMAIL_TO_OWNER=juliane@example.com
```

> **`EMAIL_TO_OWNER`** is the address that receives every contact-form submission. Set this to Juliane's actual inbox before launch. For preview, your own email works.

Save (`Ctrl+O`, `Enter`, `Ctrl+X`). Re-tighten perms in case nano touched them:

```bash
chmod 600 ~/apps/mws/.env
```

---

## Step 3 — Push the Phase 5 code from local

```bash
# On your local machine
git status
git add -A
git commit -m "Phase 5: contact form server action + Turnstile + Resend notification"
git push origin main
```

The GitHub Actions workflow will SSH in, rebuild the image with the new env vars baked into `next build` (the `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is a build-time constant — it gets inlined into the client bundle), and restart the container.

> **One subtle thing:** `NEXT_PUBLIC_*` env vars are read at *build time* by Next.js, not at runtime. The deploy workflow (`docker compose up -d --build mws-web`) passes env from `.env` automatically because of the `env_file: - .env` in `docker-compose.prod.yml`, but the build context inside the container reads them via the standard `process.env` lookup during `pnpm build`. As long as the `.env` is in place on the VPS before the workflow runs, the site key gets baked into the bundle correctly.

Watch the workflow:
```bash
# Local
gh run watch                              # if you have gh CLI
# or just refresh the Actions tab on GitHub
```

---

## Step 4 — Smoke-test the contact form

Open `https://mws.kho-ai.com/contact` in a browser.

1. **Turnstile widget renders.** You should see a small "I'm not a robot" / managed challenge widget below the message field. If it shows the dev placeholder text "Spam check disabled", `NEXT_PUBLIC_TURNSTILE_SITE_KEY` didn't make it into the build — see Troubleshooting below.

2. **Fill the form** with realistic-looking data:
   - Name: your name
   - Email: your real email
   - Wedding date: anything
   - Message: any text
   - Check 1–2 services
   - Wait for the Turnstile widget to flip to a green check (or pass invisibly).
3. **Click Send to Juliane.** The button shows "Sending…" briefly, then the whole form is replaced with the "Thank you" panel.

### Verify the database write

```bash
ssh deploy@178.156.252.76
KHOAI_NET=$(docker network ls --format '{{.Name}}' | grep khoai-network | head -1)

docker run --rm --network "$KHOAI_NET" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws \
    -c "SELECT id, created_at, name, email, language, status FROM contacts ORDER BY created_at DESC LIMIT 5;"
```

You should see your test row with `status = 'new'`.

### Verify the email landed

Open Juliane's inbox (or whichever address `EMAIL_TO_OWNER` points to). You should have an email:

- **From:** `no-reply@kho-ai.com` (or whatever `EMAIL_FROM` is)
- **Reply-To:** the email you typed in the form
- **Subject:** `New contact: <your name>`
- **Body:** plain-text summary with name, email, services, message body, and a submission ID

Replying to the email goes directly to the customer's inbox (because of `Reply-To`).

---

## Verification checklist

- [ ] Turnstile dashboard shows the `mws` site with hostnames listed and "Active"
- [ ] `~/apps/mws/.env` has `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `EMAIL_TO_OWNER`
- [ ] GitHub Actions deploy was green
- [ ] `docker logs mws-web --tail 20` shows `Ready in N ms` (no startup errors about missing env vars)
- [ ] `https://mws.kho-ai.com/contact` renders the Turnstile widget (not the "Spam check disabled" placeholder)
- [ ] Submitting a real form returns the Thank-you panel
- [ ] A row appears in the `contacts` table with the submission
- [ ] The email arrives in Juliane's inbox (check spam folder once)
- [ ] Replying to the email goes to the customer's email, not to `no-reply@kho-ai.com`

---

## Troubleshooting

**Form submit shows "Spam check failed. Please refresh and try again."**
The Turnstile token didn't verify. Causes in order of likelihood:
- The hostname you're visiting isn't in the Turnstile site's allowed hostnames. Add it (e.g. `localhost` for dev).
- Server time is skewed > 5 minutes from real time. `timedatectl status` on the VPS.
- `TURNSTILE_SECRET_KEY` is for a different site than `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Both must come from the same Turnstile site row.
- Cloudflare temporarily flagged your IP (rare). Try from a phone on cellular.

**Form shows "(Spam check disabled — NEXT_PUBLIC_TURNSTILE_SITE_KEY not configured.)"**
The env var didn't reach the build. Check:
- Is it in `~/apps/mws/.env`? (`grep TURNSTILE ~/apps/mws/.env`)
- Did the deploy actually rebuild? `docker logs mws-web --tail 80` should show recent restart.
- Was the var present *before* `docker compose build` ran? It's read at build time, not runtime.

**Form submits successfully but no email arrives.**
- Check `docker logs mws-web` for `[contact] Resend send failed:` — bad API key or unverified sender domain.
- Check Resend dashboard → **Emails** for the send attempt. Status `failed` shows the error.
- `EMAIL_TO_OWNER` typo? Send to `tpthiep+test@gmail.com` to sanity-check first.
- Email landed in spam — happens for first-time senders; mark as "Not spam" and over time deliverability improves.

**Form submits, no email, no DB row.**
The server action errored before either. `docker logs mws-web` will show the exception. Common: `DATABASE_URL` got dropped from `.env` accidentally, or Postgres hostname doesn't resolve.

**Real users say the widget "won't load" but you can't reproduce.**
- Check Cloudflare's Turnstile analytics dashboard. It shows challenge solve / fail rates per hostname.
- Some corporate firewalls block `challenges.cloudflare.com`. Edge case — accept it; widget falls back to a managed challenge that usually still works.

---

## Rollback

If Phase 5 misbehaves and you want the Phase 4 stub form back temporarily:

```bash
ssh deploy@178.156.252.76
cd ~/apps/mws
git log --oneline -10                          # find the Phase 4 commit
git checkout <phase-4-commit-sha>
docker compose -f docker-compose.prod.yml up -d --build mws-web
```

The `contacts` table stays — Phase 4 just doesn't insert anything new. The DB schema is forward-compatible.

To roll back schema changes too (only needed if you really want a clean slate, **deletes data**):
```bash
docker run --rm --network "$KHOAI_NET" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws -c "DROP TABLE IF EXISTS contacts CASCADE;"
```

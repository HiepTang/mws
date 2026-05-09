# MWS — Phase 2 Resend Setup + Deploy Runbook (copy-paste)

**Audience:** you (Hiep), one-time Resend signup + domain verification, then deploy.
**Time:** ~25–40 minutes (most of it is waiting for DNS/Resend verification, which is asynchronous).
**Prerequisites:**
- Phase 1 complete — `https://mws.kho-ai.com` serves the Next.js starter page over HTTPS.
- The kho-ai DNS zone is on Cloudflare (it is, per the AVP runbook).
- You have access to https://github.com/HiepTang/mws and the VPS as `deploy@178.156.252.76`.

This runbook covers the manual / external-service steps for Phase 2:
1. Sign up for Resend.
2. Verify `kho-ai.com` as a sender domain (3 DNS records on Cloudflare).
3. Generate an API key.
4. Add Auth.js + Resend env vars on the VPS.
5. Pull the Phase 2 code, deploy, verify magic-link login.

The code-side work (Drizzle schema, migration runner, Auth.js v5, /signin and /admin pages) is already in the `mws` repo — you just need to push and pull.

---

## Step 1 — Sign up for Resend

1. Go to https://resend.com/signup.
2. Create an account (Google / GitHub / email all fine).
3. Verify your account email.

You land on the Resend dashboard. Free tier is 100 emails/day, 3 000/month — plenty for magic-link logins plus eventual review/contact notifications.

---

## Step 2 — Add `kho-ai.com` as a sender domain

In the Resend dashboard:

1. Left sidebar → **Domains** → **Add Domain**.
2. **Domain**: `kho-ai.com`
3. **Region**: pick the closest to your VPS. `us-east-1` (Virginia) matches the kho-ai VPS in Ashburn — best choice.
4. Click **Add**.

Resend now offers two ways to set up DNS:

### Option A — **Auto configure** (recommended, since DNS is on Cloudflare)

Click **Auto configure**. Resend opens a Cloudflare OAuth window asking permission to write DNS records on `kho-ai.com`. Approve it, and Resend creates the MX + SPF + DKIM records itself and verifies them in ~30–60 seconds. Skip directly to Step 4 once the domain shows **Verified**.

### Option B — **Manual setup** (if Auto configure fails or you want full control)

Click **Manual setup**. Resend shows three records you'll add to Cloudflare by hand:

| Type | Host | Value | Note |
|---|---|---|---|
| `MX` | `send.kho-ai.com` | `feedback-smtp.us-east-1.amazonses.com` priority `10` | Bounce/complaint feedback |
| `TXT` | `send.kho-ai.com` | `v=spf1 include:amazonses.com ~all` | SPF |
| `TXT` | `resend._domainkey.kho-ai.com` | `p=MIGfMA0GCSqG...` (long key) | DKIM |

> **Don't close the Resend page** — keep these values visible. You'll paste them into Cloudflare in Step 3.

---

## Step 3 — Add the DNS records on Cloudflare (skip if you used Auto configure)

In the Cloudflare dashboard for `kho-ai.com`:

1. Left sidebar → **DNS** → **Records** → **Add record**.
2. For each row in Resend's table:

   **MX record:**
   - Type: `MX`
   - Name: `send` (Cloudflare appends `.kho-ai.com` automatically)
   - Mail server: `feedback-smtp.us-east-1.amazonses.com`
   - Priority: `10`
   - Proxy status: **DNS only** (grey cloud — MX records can't be proxied)
   - Click **Save**.

   **TXT record (SPF):**
   - Type: `TXT`
   - Name: `send`
   - Content: `v=spf1 include:amazonses.com ~all`
   - Proxy status: DNS only
   - Save.

   **TXT record (DKIM):**
   - Type: `TXT`
   - Name: `resend._domainkey`
   - Content: paste the entire `p=MIGfMA0GCSqG...` value Resend provided. Cloudflare may refuse if it includes outer `"` quotes — strip them; Cloudflare adds them automatically.
   - Proxy status: DNS only
   - Save.

3. Optional but recommended — add a DMARC record so receiving servers know what to do with mail that fails SPF/DKIM:
   - Type: `TXT`
   - Name: `_dmarc`
   - Content: `v=DMARC1; p=none; rua=mailto:postmaster@kho-ai.com`
   - Proxy status: DNS only

Wait ~2–10 minutes for propagation, then in the Resend dashboard click **Verify DNS Records**. All three rows should flip to green checkmarks.

> **Troubleshooting:** if SPF or DKIM stays red after 15 minutes, check `dig +short TXT send.kho-ai.com` from your laptop. If the value matches what you pasted, click verify in Resend again. Cloudflare-proxied records sometimes show oddly to verifiers; setting "DNS only" (grey cloud) usually fixes it.

---

## Step 4 — Generate an API key

In Resend:

1. Left sidebar → **API Keys** → **Create API Key**.
2. **Name:** `mws-vps`
3. **Permission:** `Sending access`
4. **Domain:** `kho-ai.com` (restricts the key to just this verified domain)
5. Click **Add**.

Resend shows the key **once** as `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. Copy it. **Save it somewhere temporary** — you'll paste into the VPS `.env` in Step 6.

---

## Step 5 — Push the Phase 2 code from local

If you haven't already:

```bash
# On your local machine, in C:\Users\tpthi\mws
git status                        # see the Phase 2 changes
git add -A
git commit -m "Phase 2: Drizzle schema + migrations + Auth.js v5 + Resend Email provider"
git push origin main
```

The GitHub Actions workflow will fire and try to deploy. **It will fail at this point** because the new code expects env vars (`AUTH_SECRET`, `RESEND_API_KEY`, etc.) that aren't on the VPS yet. That's fine — Step 6 fixes it.

---

## Step 6 — Add the Phase 2 env vars on the VPS

```bash
ssh deploy@178.156.252.76

# Generate AUTH_SECRET — Auth.js requires this for signing JWTs / cookies
openssl rand -base64 32
# Copy the output, you'll paste it into AUTH_SECRET below
```

Edit the `.env`:

```bash
nano ~/apps/mws/.env
```

Append these lines (don't remove the Phase 0 / Phase 1 ones):

```bash
# Auth.js
AUTH_SECRET=<paste-the-openssl-output-here>
AUTH_URL=https://mws.kho-ai.com
AUTH_TRUST_HOST=true
ALLOWED_ADMIN_EMAILS=tpthiep@gmail.com,juliane@example.com

# Resend
RESEND_API_KEY=re_<paste-the-resend-key-from-step-4>
EMAIL_FROM=no-reply@kho-ai.com
```

> **`ALLOWED_ADMIN_EMAILS`:** comma-separated. Put your own email first (so you can test), Juliane's second once you have it. Only emails on this list can complete the magic-link sign-in. Everyone else gets the email but the link returns "Sign-in failed".
>
> **`EMAIL_FROM`:** must be `something@kho-ai.com` since that's the verified domain. We'll switch to `something@mississaugaweddsols.com` at Phase 9 launch.

Save (`Ctrl+O`, `Enter`, `Ctrl+X`). Verify perms are still locked:

```bash
chmod 600 ~/apps/mws/.env
ls -la ~/apps/mws/.env
# Should show: -rw------- deploy deploy
```

---

## Step 7 — Pull the Phase 2 code and rebuild

```bash
cd ~/apps/mws
git pull origin main
git log -1 --oneline   # confirm Phase 2 commit landed

# Rebuild the image — `--no-cache` not strictly needed since package.json
# changes invalidate the deps layer naturally, but it removes any doubt.
docker compose -f docker-compose.prod.yml build mws-web

# Restart the container. The new entrypoint will:
#   1. Run `node migrate.mjs` — applies all pending Drizzle migrations
#   2. Start `node server.js` — the Next.js server
docker compose -f docker-compose.prod.yml up -d mws-web

# Watch the boot log for migration output, then "Ready in N ms"
docker logs mws-web --tail 80 -f
```

Expected log output (truncated):
```
[migrate] applying pending migrations...
[migrate] done.
   ▲ Next.js 16.2.6
   - Local:        http://0.0.0.0:3000
 ✓ Ready in 234ms
```

If migrations fail (DB unreachable, wrong password, schema conflict), the container exits non-zero and Docker keeps it `restarting`. Check `docker logs mws-web` for the error.

Confirm the schema applied — from the VPS:

```bash
KHOAI_NET=$(docker network ls --format '{{.Name}}' | grep khoai-network | head -1)

docker run --rm --network "$KHOAI_NET" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws -c "\dt"
```

Should list 7 tables: `__drizzle_migrations`, `account`, `contacts`, `reviews`, `session`, `user`, `verificationToken`.

---

## Step 8 — Verify the magic-link sign-in end-to-end

In a browser:

1. Visit `https://mws.kho-ai.com/signin`.
2. Enter your email (must be one of the addresses in `ALLOWED_ADMIN_EMAILS`).
3. Click **Send link**. The page redirects to `/signin?check-email=1` and shows "Check your inbox".
4. Open your inbox. You should have an email **from `no-reply@kho-ai.com`** with subject "Sign in to MWS" (Auth.js default subject — we can customize later).
5. Click the link in the email. Browser lands on `https://mws.kho-ai.com/admin` showing "Signed in as `<your email>`".
6. Click **Sign out**. You're redirected to `/`.

If that whole loop works, Phase 2 is complete.

---

## Verification checklist

- [ ] Resend dashboard shows `kho-ai.com` with all DNS records green
- [ ] Resend API key `mws-vps` exists, scoped to `kho-ai.com`
- [ ] `~/apps/mws/.env` has `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `ALLOWED_ADMIN_EMAILS`, `RESEND_API_KEY`, `EMAIL_FROM`
- [ ] `docker logs mws-web` shows `[migrate] done` followed by `Ready in Nms`
- [ ] `psql -U mws -d mws -c "\dt"` lists the expected 7 tables
- [ ] `/signin` page loads
- [ ] Magic-link email arrives from `no-reply@kho-ai.com` (check spam folder once)
- [ ] Clicking the link signs you in to `/admin`
- [ ] Email NOT in `ALLOWED_ADMIN_EMAILS` is rejected at link click (callback returns false)
- [ ] kho-ai unaffected; AVP unaffected

When all are checked, Phase 2 is done. Phase 3 (shared shell — header, footer, EN/VI toggle) is next.

---

## Troubleshooting

**Magic-link email never arrives:**
- Check Resend dashboard → **Emails** for the send attempt. Status `delivered` means Resend handed it off; if not in your inbox, it landed in spam.
- Status `failed` means a delivery error — open the row for the bounce/error message.
- Status missing entirely means Auth.js never called Resend. Check `docker logs mws-web` for errors at sign-in time. Common causes: `RESEND_API_KEY` typo, `EMAIL_FROM` not on a verified domain, `AUTH_URL` mismatch with the actual origin.

**Magic-link works but lands on `/signin?error=1` instead of `/admin`:**
- Your email isn't in `ALLOWED_ADMIN_EMAILS`. Check `~/apps/mws/.env`, restart container after fixing.
- Or `AUTH_SECRET` changed since the link was issued — links signed with old secret are invalid. Re-request the link.

**`docker logs mws-web` shows `[migrate] failed: ...`:**
- `password authentication failed for user "mws"` → `DATABASE_URL` in `.env` doesn't match the Postgres role password. Fix and restart.
- `relation "..." already exists` → migration was partially applied. Drop the rogue tables and let drizzle's `__drizzle_migrations` tracking re-run cleanly: `psql -U khoai -d mws -c "DROP TABLE ..."`.
- `permission denied for schema public` → the `mws` role missed a grant. Re-run the `GRANT ALL ON SCHEMA public TO mws;` from Phase 0 Step 3.3.

**Sign-in form does nothing on submit:**
- Check browser devtools network tab — is the POST to `/api/auth/signin/resend` 200 or error?
- 500 error usually means Resend isn't configured. Check `docker logs mws-web` for the exception.
- If the form redirects but no email comes, `EMAIL_FROM` is on an unverified domain — Resend silently drops or returns an error.

**Resend says SPF/DKIM not verified after 30 minutes:**
- Recheck the values in Cloudflare exactly match Resend's spec — extra whitespace, missing `~all`, mistyped `_domainkey` are common.
- Cloudflare might have auto-prepended your TXT value with a quote pair. Try editing the record and removing wrapping `"`.
- Run `dig +short TXT resend._domainkey.kho-ai.com` from your laptop. If empty, DNS hasn't propagated; if non-empty but Resend still red, the value differs.

---

## Rollback

To revert Phase 2 (e.g. if Auth.js is misbehaving and you want the old Phase 1 container back):

```bash
cd ~/apps/mws
git log --oneline -10              # find the Phase 1 commit SHA
git checkout <phase-1-commit-sha>
docker compose -f docker-compose.prod.yml up -d --build mws-web
```

The Phase 2 schema stays in Postgres (no harm — the Phase 1 image just doesn't use the auth tables). To roll back the schema too:

```bash
docker run --rm --network "$KHOAI_NET" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws <<'EOF'
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS "verificationToken" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS __drizzle_migrations CASCADE;
EOF
```

# MWS — kho-ai VPS Phase 0 Ops Runbook (copy-paste)

**Audience:** you (Hiep), running the VPS-side setup once.
**Time:** ~30–45 minutes assuming `kho-ai.com` is already on Cloudflare DNS (it is, per the AVP runbook).
**Prerequisite:** read `TECH_STACK_AND_PLAN.md` for context. This runbook is just the commands.

This is the operational implementation of Phase 0 from the plan. When you're done with everything in this runbook, the VPS is ready for the Phase 1 Next.js scaffold to be deployed by GitHub Actions.

The flow mirrors the AVP umbrella runbook: Cloudflare A record → VPS dirs → Caddy site block serving a placeholder → cert issued → ready. The MWS-specific additions are (a) creating a dedicated Postgres database and role on the existing shared `khoai-postgres`, and (b) creating a private MinIO bucket and scoped user on the existing shared `khoai-minio`.

---

## Before you start — resolve the kho-ai Docker network name

Docker Compose prefixes its network names with the project name (typically the parent directory). The compose file declares `khoai-network` but the actual Docker network might be `infrastructure_khoai-network` or similar. Find the real name once and export it for the rest of the session:

```bash
ssh deploy@178.156.252.76

KHOAI_NET=$(docker network ls --format '{{.Name}}' | grep khoai-network | head -1)
echo "KHOAI_NET=$KHOAI_NET"
# Should print something like: infrastructure_khoai-network
```

Every `docker run --network ...` command in this runbook uses `"$KHOAI_NET"` — keep this shell session open, or re-export the variable each time you SSH back in.

---

## Step 1 — Cloudflare DNS

`kho-ai.com` is already on Cloudflare (set up during the AVP migration). Just add the new subdomain:

1. Cloudflare dashboard → **kho-ai.com** zone → **DNS** → **Records** → **Add record**
2. Fields:
   - Type: `A`
   - Name: `mws`
   - IPv4 address: `178.156.252.76`
   - Proxy status: **Proxied** (orange cloud)
   - TTL: `Auto`
3. Save

### Verify (from your local machine):

```powershell
nslookup mws.kho-ai.com
```

Should resolve to a Cloudflare IP (because proxy is on). Allow 5–30 min for global propagation.

---

## Step 2 — VPS prep: directories and placeholder

SSH into the VPS as `deploy`:

```bash
ssh deploy@178.156.252.76
```

Once on the VPS, run this entire block:

```bash
# Create host directory for the Phase 0 placeholder Caddy will serve
sudo mkdir -p /srv/mws/placeholder
sudo chown -R deploy:deploy /srv/mws
chmod 755 /srv/mws /srv/mws/placeholder

# Note: there is NO /srv/mws/uploads directory. Image uploads go to the shared
# khoai-minio bucket `mws-uploads` (created in Step 4), not to the host filesystem.

# Drop a placeholder so Caddy has something to serve before Phase 1
cat > /srv/mws/placeholder/index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mississauga Wedding Solutions — coming soon</title>
  <style>
    body {
      font: 16px/1.5 system-ui, -apple-system, sans-serif;
      max-width: 600px; margin: 80px auto; padding: 0 20px;
      color: #2a1410; background: #fbf8f3;
    }
    h1 { font-family: Georgia, "Cormorant Garamond", serif; font-size: 36px; letter-spacing: -0.01em; margin: 0 0 12px; color: #9a1f2c; }
    p  { color: #5a4a44; }
    .accent { color: #c9a55e; }
  </style>
</head>
<body>
  <h1>Mississauga Wedding Solutions</h1>
  <p>New site under construction — preview environment on the kho-ai umbrella VPS.</p>
  <p class="accent">Caddy is serving this placeholder from <code>/srv/mws/placeholder</code>.</p>
</body>
</html>
EOF

# Optional: simple 404 page so Caddy's handle_errors has something to show
cat > /srv/mws/placeholder/404.html <<'EOF'
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Not found</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:600px;margin:80px auto;padding:0 20px;color:#2a1410;background:#fbf8f3}</style>
</head><body><h1>404</h1><p>Page not found.</p></body></html>
EOF

ls -la /srv/mws/ /srv/mws/placeholder/
# Should show:
#   /srv/mws/placeholder owned by deploy:deploy
#   placeholder/index.html and placeholder/404.html
```

---

## Step 3 — Postgres: create `mws` database and role

The shared `khoai-postgres` container is already running. We add a new database and a dedicated role with privileges only on that database.

### 3.1 Generate a strong password

On the VPS:

```bash
# Generate a 32-char password and STORE IT — you'll paste it into the mws .env in Phase 1
openssl rand -base64 32
<MWS_PASSWORD>
```

Copy the output (e.g. `kP9...=`). Keep it on your clipboard for Step 3.3, and write it down somewhere temporary — you'll need it again in Phase 1 when configuring `mws-web`.

### 3.2 Find the kho-ai Postgres superuser credentials

The kho-ai compose uses the `POSTGRES_USER` from `~/apps/kho-ai/infrastructure/.env`:

```bash
grep '^POSTGRES_USER\|^POSTGRES_PASSWORD\|^POSTGRES_DB=' ~/apps/kho-ai/infrastructure/.env

POSTGRES_USER=khoai
POSTGRES_PASSWORD=CHANGE_ME_strong_password_here_32chars
POSTGRES_DB=khoai
```

Note the `POSTGRES_USER` value (typically `khoai`) — that's the superuser inside the postgres container. We'll connect as that role to create the new database and grants.

### 3.3 Create database and role

Replace `<MWS_PASSWORD>` with the password from Step 3.1. Run from the VPS:

```bash
cd ~/apps/kho-ai/infrastructure

# Open psql as the kho-ai superuser, against the postgres container
docker compose -f docker-compose.prod.yml exec postgres \
  psql -U khoai -d postgres
```

You're now in the psql prompt. Paste this block (replacing `<MWS_PASSWORD>`):

```sql
-- Create the database
CREATE DATABASE mws;

-- Create the role with login + password
CREATE ROLE mws WITH LOGIN PASSWORD '<MWS_PASSWORD>';

-- Database-level privileges
GRANT ALL PRIVILEGES ON DATABASE mws TO mws;

-- Switch to the new database to set schema-level grants
\c mws
GRANT ALL ON SCHEMA public TO mws;
ALTER SCHEMA public OWNER TO mws;

-- Make sure the mws role owns future objects it creates
ALTER DEFAULT PRIVILEGES FOR ROLE mws IN SCHEMA public
  GRANT ALL ON TABLES TO mws;
ALTER DEFAULT PRIVILEGES FOR ROLE mws IN SCHEMA public
  GRANT ALL ON SEQUENCES TO mws;

-- Block mws from peeking into the khoai database
REVOKE ALL ON DATABASE khoai FROM mws;
REVOKE ALL ON DATABASE khoai FROM PUBLIC;

-- Sanity check: list databases and roles
\l
\du

-- Exit
\q
```

### 3.4 Verify the new role can connect

Still on the VPS, test connecting as the new role from inside another short-lived postgres-client container on the same Docker network:

```bash
docker run --rm -it \
  --network "infrastructure_khoai-network" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws -c "SELECT current_database(), current_user, version();"
```

Expected output:

```
 current_database | current_user |  version
------------------+--------------+----------
 mws              | mws          | PostgreSQL 15.x ...
```

If that works, the database is ready. If not, see Troubleshooting.

---

## Step 4 — MinIO: create `mws-uploads` bucket and scoped user

The shared `khoai-minio` container is already running. We add one private bucket and one MinIO user whose policy grants access only to that bucket — no visibility into kho-ai's `invoices`, `counting-photos`, or `voice-recordings` buckets.

### 4.1 Generate MinIO credentials for the mws user

On the VPS:

```bash
# Access key — alphanumeric only to avoid shell quoting headaches
MWS_S3_ACCESS_KEY=$(openssl rand -hex 12)
echo "MWS_S3_ACCESS_KEY=$MWS_S3_ACCESS_KEY"
MWS_S3_ACCESS_KEY=<MWS_S3_ACCESS_KEY>

# Secret key — base64, will contain mixed chars but we'll quote properly
MWS_S3_SECRET_KEY=$(openssl rand -base64 32)
echo "MWS_S3_SECRET_KEY=$MWS_S3_SECRET_KEY"
MWS_S3_SECRET_KEY=<MWS_S3_SECRET_KEY>

```

**Save both values** — Phase 1 will paste them into the `mws` repo's deploy env.

### 4.2 Read the kho-ai MinIO root credentials

These are needed to authenticate the `mc` admin client. They're already in the kho-ai `.env`:

```bash
ROOT_ACCESS=$(grep '^S3_ACCESS_KEY=' ~/apps/kho-ai/infrastructure/.env | cut -d= -f2-)
ROOT_SECRET=$(grep '^S3_SECRET_KEY=' ~/apps/kho-ai/infrastructure/.env | cut -d= -f2-)

# Sanity check (length only — don't print the values)
echo "Root access key length: ${#ROOT_ACCESS}"
Root access key length: 34
echo "Root secret key length: ${#ROOT_SECRET}"
Root secret key length: 34
```

### 4.3 Write the bucket policy

```bash
mkdir -p ~/tmp
cat > ~/tmp/mws-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowMwsUploadsBucketOnly",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::mws-uploads",
        "arn:aws:s3:::mws-uploads/*"
      ]
    }
  ]
}
EOF
```

### 4.4 Run a one-shot mc container to create the bucket, user, and policy

```bash
docker run --rm \
  --network "infrastructure_khoai-network" \
  -v ~/tmp/mws-policy.json:/tmp/mws-policy.json:ro \
  -e MC_ROOT_ACCESS="$ROOT_ACCESS" \
  -e MC_ROOT_SECRET="$ROOT_SECRET" \
  -e MWS_ACCESS="$MWS_S3_ACCESS_KEY" \
  -e MWS_SECRET="$MWS_S3_SECRET_KEY" \
  --entrypoint /bin/sh \
  minio/mc:latest -c '
    set -e

    # Configure mc to talk to the local MinIO as root
    mc alias set local http://minio:9000 "$MC_ROOT_ACCESS" "$MC_ROOT_SECRET"

    # Create the bucket (no-op if it already exists)
    mc mb --ignore-existing local/mws-uploads

    # Bucket stays PRIVATE — explicitly set no anonymous access
    mc anonymous set none local/mws-uploads

    # Create or update the mws user
    mc admin user add local "$MWS_ACCESS" "$MWS_SECRET"

    # Create the mws-readwrite policy from the JSON file
    mc admin policy create local mws-readwrite /tmp/mws-policy.json || \
      mc admin policy add local mws-readwrite /tmp/mws-policy.json

    # Attach the policy to the mws user
    mc admin policy attach local mws-readwrite --user "$MWS_ACCESS" || \
      mc admin policy set local mws-readwrite user="$MWS_ACCESS"

    # Confirm
    echo "--- buckets ---"
    mc ls local/
    echo "--- users ---"
    mc admin user list local
    echo "--- policy on mws-uploads ---"
    mc anonymous get local/mws-uploads
  '
```

> The script tries the modern `mc admin policy create / attach` syntax first and falls back to legacy `add / set` for older `mc` images. Either path leaves the same result.

Expected output ends with the bucket listed, the `mws` user listed, and `Access permission for 'local/mws-uploads' is 'private'` (older `mc` versions print `'none'` instead — same meaning: no anonymous access).

### 4.5 Verify the scoped user can read/write only `mws-uploads`

```bash
docker run --rm \
  --network "$KHOAI_NET" \
  -e MWS_ACCESS="$MWS_S3_ACCESS_KEY" \
  -e MWS_SECRET="$MWS_S3_SECRET_KEY" \
  --entrypoint /bin/sh \
  minio/mc:latest -c '
    mc alias set test http://minio:9000 "$MWS_ACCESS" "$MWS_SECRET"

    echo "--- can list mws-uploads (should be empty, no error) ---"
    mc ls test/mws-uploads || echo "FAIL"

    echo "--- can write a test object ---"
    echo "hello mws" | mc pipe test/mws-uploads/hello.txt
    mc cat test/mws-uploads/hello.txt
    mc rm test/mws-uploads/hello.txt

    echo "--- should NOT be able to list invoices (expect Access Denied) ---"
    mc ls test/invoices && echo "UNEXPECTED: mws can read invoices, fix policy" || echo "OK: access denied as expected"
  '
```

If the last line says `OK: access denied as expected`, isolation is working.

### 4.6 Clean up the temporary policy file

```bash
# The policy is stored inside MinIO now; remove the host-side scratch file
rm ~/tmp/mws-policy.json
rmdir ~/tmp 2>/dev/null || true   # ok if non-empty; just trying
```

---

## Step 5 — Edit `docker-compose.prod.yml` to mount the placeholder into Caddy

```bash
nano ~/apps/kho-ai/infrastructure/docker-compose.prod.yml
```

Find the `caddy:` service. It should already have an `/srv/avp:/srv/avp:ro` line from the AVP runbook. Add a second line for MWS right below:

```yaml
  caddy:
    image: caddy:2-alpine
    container_name: khoai-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
      - /srv/avp:/srv/avp:ro
      - /srv/mws/placeholder:/srv/mws:ro      # ← ADD THIS LINE
    depends_on:
      - api
      - web
      - keycloak
    networks:
      - khoai-network
```

> **Why mount `/srv/mws/placeholder` as `/srv/mws:ro`?** During Phase 0, Caddy only needs the placeholder; mounting it at `/srv/mws` inside the container keeps the Caddyfile's `root * /srv/mws` clean. Phase 1 will remove this mount entirely (because Caddy will switch to `reverse_proxy mws-web:3000` and stop serving files for MWS).

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

---

## Step 6 — Add the Caddy site block for `mws.kho-ai.com`

```bash
nano ~/apps/kho-ai/infrastructure/caddy/Caddyfile
```

Append this block at the bottom of the file (after the existing `kho-ai.com`, `api.kho-ai.com`, `avp.kho-ai.com`, etc. blocks):

```caddyfile

# ─── MWS site (Phase 0: static placeholder, becomes reverse_proxy in Phase 1) ──
mws.kho-ai.com {
    root * /srv/mws
    encode gzip zstd
    file_server

    # Long cache for fingerprinted assets (won't trigger in Phase 0; ready for Phase 1+)
    @assets path /_next/static/* /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    # No cache for HTML so content updates aren't held back by edge cache
    @html path *.html /
    header @html Cache-Control "public, max-age=0, must-revalidate"

    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "interest-cohort=()"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
    header -Server

    handle_errors {
        @404 expression {http.error.status_code} == 404
        rewrite @404 /404.html
        file_server
    }
}
```

Save and exit.

---

## Step 7 — Apply the changes (recreate Caddy)

Because we changed `docker-compose.prod.yml` (added a volume mount), the container needs to be recreated, not just reloaded:

```bash
cd ~/apps/kho-ai/infrastructure
docker compose -f docker-compose.prod.yml up -d caddy

# If Compose says "no changes", force it:
# docker compose -f docker-compose.prod.yml up -d --force-recreate caddy

# Watch the logs for cert issuance — should see Let's Encrypt success within ~15 sec
docker logs khoai-caddy --tail 50 -f
# Press Ctrl+C to exit the log stream once you see "certificate obtained successfully" for mws.kho-ai.com
```

---

## Step 8 — Verify

### From the VPS itself:

```bash
# Should return HTTP/2 200 from server: Caddy
curl -I https://mws.kho-ai.com

# Should return the placeholder HTML
curl https://mws.kho-ai.com | head -20
```

### From your local browser:

Open `https://mws.kho-ai.com` — you should see the placeholder page with the red headline, served over HTTPS with a valid Let's Encrypt cert.

### Postgres readiness (re-confirm):

```bash
docker run --rm -it \
  --network "$KHOAI_NET" \
  -e PGPASSWORD='<MWS_PASSWORD>' \
  postgres:15-alpine \
  psql -h postgres -U mws -d mws -c "SELECT 'mws db reachable' AS ok;"
```

If you get `ok`, the database is ready for Phase 1's Drizzle migrations.

### MinIO readiness (re-confirm):

```bash
docker run --rm \
  --network "$KHOAI_NET" \
  -e MWS_ACCESS="<MWS_S3_ACCESS_KEY>" \
  -e MWS_SECRET="<MWS_S3_SECRET_KEY>" \
  --entrypoint /bin/sh \
  minio/mc:latest -c '
    mc alias set test http://minio:9000 "$MWS_ACCESS" "$MWS_SECRET" >/dev/null
    mc ls test/mws-uploads && echo "OK: mws-uploads reachable"
  '
```

---

## Done — verification checklist

After all 8 steps, confirm:

- [ ] `https://mws.kho-ai.com` loads the placeholder HTML in a browser, with a valid HTTPS lock icon
- [ ] `curl -I https://mws.kho-ai.com` returns `HTTP/2 200` from `server: Caddy`
- [ ] DNS check on `dnschecker.org` for `mws.kho-ai.com` shows the record propagated globally
- [ ] On the VPS: `docker ps | grep caddy` shows `khoai-caddy` healthy
- [ ] On the VPS: `ls -la /srv/mws/placeholder/` shows `index.html` and `404.html`
- [ ] `docker exec khoai-postgres psql -U khoai -d postgres -c "\l"` lists the `mws` database
- [ ] `psql -h postgres -U mws -d mws` (from a postgres-client container on `khoai-network`) connects successfully
- [ ] `mc ls local/mws-uploads` (run from a one-off mc container as the mws user) succeeds and `mc ls local/invoices` is denied
- [ ] kho-ai itself is unaffected: `https://kho-ai.com`, `https://api.kho-ai.com/health`, `https://auth.kho-ai.com` all still respond
- [ ] AVP is unaffected: `https://avp.kho-ai.com` still loads
- [ ] You have the **three secrets** saved somewhere temporary for Phase 1:
  - `<MWS_PASSWORD>` (Postgres role password from Step 3.1)
  - `<MWS_S3_ACCESS_KEY>` (MinIO access key from Step 4.1)
  - `<MWS_S3_SECRET_KEY>` (MinIO secret key from Step 4.1)

When all are checked, Phase 0 is complete. Phase 1 will:

1. Scaffold the Next.js app on your local machine.
2. Push to a new GitHub repo `mws`.
3. Add `mws-web` as a Docker service on `khoai-network`, with environment:
   - `DATABASE_URL=postgres://mws:<MWS_PASSWORD>@postgres:5432/mws`
   - `S3_ENDPOINT=http://minio:9000`
   - `S3_BUCKET=mws-uploads`
   - `S3_ACCESS_KEY=<MWS_S3_ACCESS_KEY>`
   - `S3_SECRET_KEY=<MWS_S3_SECRET_KEY>`
   - `S3_FORCE_PATH_STYLE=true` (MinIO is path-style, not virtual-host)
4. Replace the Caddy `mws.kho-ai.com` block: swap `root * /srv/mws / file_server` for `reverse_proxy mws-web:3000`, and remove the `/srv/mws/placeholder` volume mount from the caddy service (no longer needed).
5. Wire GitHub Actions to deploy via the existing `deploy` user pattern.

---

## Troubleshooting

**`https://mws.kho-ai.com` returns 502 / 503 / `connection refused`:**
- Likely the Let's Encrypt cert is still being issued. Wait 30 sec, retry.
- Check Caddy logs: `docker logs khoai-caddy --tail 100`
- If you see `solver.go: ... no IP address found`, DNS hasn't propagated yet — wait longer.
- If you see `permission denied` mount errors, check ownership: `ls -ld /srv/mws/placeholder` should show `deploy:deploy`.

**Cert won't issue (Cloudflare proxy enabled):**
Sometimes Cloudflare's edge interferes with the HTTP-01 challenge. Two fixes:
1. Temporarily set DNS to **DNS only** (gray cloud) in Cloudflare for `mws`, wait for cert to issue, re-enable proxy.
2. Add `tls { dns cloudflare {env.CF_API_TOKEN} }` to the Caddy block to use DNS-01 challenge instead — needs the `caddy-dns/cloudflare` plugin and a Cloudflare API token. Skip unless option 1 fails.

**`docker compose up -d caddy` says "no changes":**
Add `--force-recreate`: `docker compose -f docker-compose.prod.yml up -d --force-recreate caddy`

**`psql -U mws` fails with "FATAL: password authentication failed":**
- The `<MWS_PASSWORD>` you typed in Step 7 doesn't match what was set in Step 3.3. Re-create the role with a fresh password:
  ```sql
  ALTER ROLE mws WITH PASSWORD '<NEW_PASSWORD>';
  ```
- Beware: special chars in the password (especially `$`, `'`, backtick, `\`) need to be escaped in shell single-quotes, or — easier — generate a password using only `A-Za-z0-9+/=` (which `openssl rand -base64` already produces, except sometimes `+` and `/`).

**`psql -U mws` fails with "FATAL: role 'mws' does not exist":**
You connected to a different Postgres than the one we modified. Make sure the `khoai-network` matches and the host is `postgres` (the service name in the kho-ai compose), not `localhost`.

**`CREATE DATABASE mws` says "database already exists":**
Either you ran the script twice, or there was a leftover from a previous attempt. Drop it and retry:
```sql
DROP DATABASE IF EXISTS mws;
DROP ROLE IF EXISTS mws;
```
Then re-run Step 3.3.

**Caddy is healthy but `mws.kho-ai.com` returns the kho-ai homepage instead of the placeholder:**
The new site block didn't get loaded. Re-check the Caddyfile syntax (Step 6), then `docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile` to confirm it parses. Reload with `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile`.

**`mc admin policy create` fails with "command not found" or "unknown command":**
The `minio/mc:latest` image you pulled is older than ~mid-2023 and uses the legacy `mc admin policy add` syntax. The runbook script tries the modern syntax first and falls back automatically — if both fail, manually run:
```bash
docker run --rm --network "$KHOAI_NET" -v ~/tmp/mws-policy.json:/tmp/p.json:ro \
  --entrypoint /bin/sh minio/mc:latest -c '
    mc alias set local http://minio:9000 "<ROOT_ACCESS>" "<ROOT_SECRET>"
    mc admin policy add local mws-readwrite /tmp/p.json
    mc admin policy set local mws-readwrite user=<MWS_S3_ACCESS_KEY>
  '
```

**`mc admin user add` says "user already exists":**
You ran the script twice. Either remove and recreate, or skip the user-create step:
```bash
mc admin user remove local <MWS_S3_ACCESS_KEY>
# then re-run Step 4.4
```
Or just rotate the secret in place:
```bash
mc admin user info local <MWS_S3_ACCESS_KEY>          # confirms the user exists
# secret rotation requires recreation in MinIO; remove + re-add is simplest
```

**Verify step 4.5 says `UNEXPECTED: mws can read invoices`:**
The policy attached too broadly, or the wrong policy got attached. Check:
```bash
mc admin user info local <MWS_S3_ACCESS_KEY>
# Should show "PolicyName: mws-readwrite", not "consoleAdmin" or "readwrite"
```
If it shows a built-in policy like `readwrite` or `consoleAdmin`, detach it and re-attach `mws-readwrite`:
```bash
mc admin policy detach local readwrite --user <MWS_S3_ACCESS_KEY>
mc admin policy attach local mws-readwrite --user <MWS_S3_ACCESS_KEY>
```

---

## Rollback (if anything breaks the existing kho-ai or AVP sites)

If touching the Caddyfile or `docker-compose.prod.yml` breaks the existing services:

```bash
cd ~/apps/kho-ai/infrastructure

# See what you changed
git diff caddy/Caddyfile docker-compose.prod.yml

# Revert both files (if they're tracked in git)
git checkout caddy/Caddyfile docker-compose.prod.yml

# Recreate Caddy with the reverted config
docker compose -f docker-compose.prod.yml up -d --force-recreate caddy
```

If the files aren't in git, manually undo your edits using the diff blocks in Steps 5 and 6 as reference (delete the added lines).

To roll back the Postgres changes specifically (if needed):

```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U khoai -d postgres <<'EOF'
DROP DATABASE IF EXISTS mws;
DROP ROLE IF EXISTS mws;
EOF
```

To roll back the MinIO changes specifically (if needed):

```bash
ROOT_ACCESS=$(grep '^S3_ACCESS_KEY=' ~/apps/kho-ai/infrastructure/.env | cut -d= -f2-)
ROOT_SECRET=$(grep '^S3_SECRET_KEY=' ~/apps/kho-ai/infrastructure/.env | cut -d= -f2-)

docker run --rm \
  --network "$KHOAI_NET" \
  -e RA="$ROOT_ACCESS" -e RS="$ROOT_SECRET" \
  -e MA="<MWS_S3_ACCESS_KEY>" \
  --entrypoint /bin/sh \
  minio/mc:latest -c '
    mc alias set local http://minio:9000 "$RA" "$RS"
    mc rb --force local/mws-uploads || true
    mc admin user remove local "$MA" || true
    mc admin policy remove local mws-readwrite || true
  '
```

The MWS additions are isolated:
- The Caddy site block is its own stanza, won't affect other domains.
- The volume mount is read-only and points at a directory that didn't exist before.
- The Postgres database/role are independent of `khoai`'s.
- The MinIO bucket and user are scoped — neither affects existing kho-ai buckets or the `khoai-api` MinIO root credentials.

There is no realistic way Phase 0 alone can break kho-ai or AVP — the failure modes are limited to "MWS itself doesn't come up" and the rollbacks above reset cleanly.

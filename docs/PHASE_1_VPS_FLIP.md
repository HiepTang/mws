# MWS — Phase 1 VPS Flip Runbook (copy-paste)

**Audience:** you (Hiep), one-time switchover from the Phase 0 placeholder to the live Next.js app.
**Time:** ~20–30 minutes (mostly waiting for the first Docker build).
**Prerequisites:**
- Phase 0 complete (DNS, Postgres `mws` DB+role, MinIO `mws-uploads` bucket+user, placeholder Caddy block serving HTTPS).
- The three Phase 0 secrets saved: `<MWS_PASSWORD>`, `<MWS_S3_ACCESS_KEY>`, `<MWS_S3_SECRET_KEY>`.
- GitHub repo `github.com/HiepTang/mws` created (private), local Next.js scaffold pushed to `main`.

This runbook flips `https://mws.kho-ai.com` from the placeholder static page to the actual Next.js container, and wires GitHub Actions to deploy on every push.

---

## Step 1 — Create the GitHub repo and push the scaffold

On your **local machine** (in `C:\Users\tpthi\mws`):

```bash
# Initialize git if not already done
git init -b main
git add .
git commit -m "Phase 1 scaffold: Next.js 15 + Docker + CI"

# Create a private repo on github.com/HiepTang/mws first, then:
git remote add origin git@github.com:HiepTang/mws.git
git push -u origin main
```

---

## Step 2 — Add GitHub Actions secrets

In the new `mws` repo on GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `VPS_HOST` | `178.156.252.76` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of your existing kho-ai deploy private key (the one used by the kho-ai repo's CI). Reuse — do **not** create a new key. |

> The same SSH key the kho-ai workflow uses works here because both repos deploy as the same `deploy` user. If you don't have it locally anymore, see kho-ai's `VPS_DEPLOYMENT_GUIDE.md` §13.1.

---

## Step 3 — Authorize the VPS to clone the new repo

The `deploy` user on the VPS needs read access to the private `mws` repo. Two options; pick one:

### 3a. Reuse the existing GitHub deploy key (simplest)

If the existing `~/.ssh/id_ed25519` on the VPS is already authorized to read kho-ai (private), add it as a deploy key on the `mws` repo too:

```bash
ssh deploy@178.156.252.76
cat ~/.ssh/id_ed25519.pub
```

Then on GitHub: `mws` repo → **Settings → Deploy keys → Add deploy key**. Paste the public key, leave **Allow write access** unchecked, save.

### 3b. Use a fresh deploy key just for mws

```bash
ssh deploy@178.156.252.76
ssh-keygen -t ed25519 -C "mws-deploy" -f ~/.ssh/mws_deploy -N ""
cat ~/.ssh/mws_deploy.pub
```

Add to `mws` repo deploy keys, then add a `~/.ssh/config` block on the VPS:

```sshconfig
Host github.com-mws
  HostName github.com
  User git
  IdentityFile ~/.ssh/mws_deploy
  IdentitiesOnly yes
```

Use `git@github.com-mws:HiepTang/mws.git` as the clone URL in Step 4.

---

## Step 4 — Clone the repo on the VPS and write the `.env`

```bash
ssh deploy@178.156.252.76

mkdir -p ~/apps
cd ~/apps
git clone git@github.com:HiepTang/mws.git    # or git@github.com-mws:HiepTang/mws.git for option 3b
cd mws
ls -la
# Should show: Dockerfile, docker-compose.prod.yml, .env.example, src/, etc.
```

Discover the Docker network name (from Phase 0):

```bash
KHOAI_NET=$(docker network ls --format '{{.Name}}' | grep khoai-network | head -1)
echo "$KHOAI_NET"
```

Write the production `.env` (replace each `<...>` with the value you saved in Phase 0):

```bash
cat > ~/apps/mws/.env <<EOF
DATABASE_URL=postgres://mws:<MWS_PASSWORD>@postgres:5432/mws

S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_BUCKET=mws-uploads
S3_ACCESS_KEY=<MWS_S3_ACCESS_KEY>
S3_SECRET_KEY=<MWS_S3_SECRET_KEY>
S3_FORCE_PATH_STYLE=true

KHOAI_NETWORK_NAME=$KHOAI_NET

NEXT_PUBLIC_SITE_URL=https://mws.kho-ai.com
EOF

chmod 600 ~/apps/mws/.env
cat ~/apps/mws/.env       # sanity check
```

---

## Step 5 — First build (manual, before flipping Caddy)

We build the container manually first so the image is ready when Caddy flips. If the build fails for any reason, the placeholder keeps serving — zero downtime risk.

```bash
cd ~/apps/mws
docker compose -f docker-compose.prod.yml build mws-web
```

Expected output ends with `Successfully tagged mws-web:latest`. Build takes ~3–6 min on a CPX21.

Start the container (still nothing routed to it yet — Caddy is still on the placeholder):

```bash
docker compose -f docker-compose.prod.yml up -d mws-web

# Wait for healthcheck to flip to `healthy`
for i in $(seq 1 30); do
  status=$(docker inspect --format '{{.State.Health.Status}}' mws-web 2>/dev/null || echo "no-container")
  echo "[$i] $status"
  if [ "$status" = "healthy" ]; then break; fi
  sleep 3
done
```

Hit the healthcheck from inside the network to confirm:

```bash
docker run --rm --network "$KHOAI_NET" curlimages/curl:latest \
  curl -sf http://mws-web:3000/api/health
# {"status":"ok","commit":"dev","timestamp":"..."}
```

---

## Step 6 — Flip the Caddy block from placeholder to reverse proxy

Edit the kho-ai Caddyfile:

```bash
nano ~/apps/kho-ai/infrastructure/caddy/Caddyfile
```

Find the `mws.kho-ai.com { ... }` block from Phase 0. **Replace the entire block** with:

```caddyfile

# ─── MWS site (live: reverse proxy to Next.js container) ──────────────
mws.kho-ai.com {
    reverse_proxy mws-web:3000

    encode gzip zstd

    # Long cache for Next's fingerprinted assets
    @assets path /_next/static/*
    header @assets Cache-Control "public, max-age=31536000, immutable"

    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "interest-cohort=()"
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
    }
    header -Server

    # Allow review-image uploads up to 10 MB
    request_body {
        max_size 10MB
    }
}
```

Save (`Ctrl+O`, `Enter`, `Ctrl+X`).

Now drop the placeholder volume mount from the Caddy service (no longer needed):

```bash
nano ~/apps/kho-ai/infrastructure/docker-compose.prod.yml
```

Find the `caddy:` service `volumes:` block and **delete** the line:

```yaml
- /srv/mws/placeholder:/srv/mws:ro
```

Leave the AVP mount and Caddyfile mount intact.

---

## Step 7 — Apply the Caddy changes

Because we changed `docker-compose.prod.yml` (removed a volume), the container needs to be recreated, not just reloaded:

```bash
cd ~/apps/kho-ai/infrastructure
docker compose -f docker-compose.prod.yml up -d caddy
# If it says "no changes":
# docker compose -f docker-compose.prod.yml up -d --force-recreate caddy

# Watch logs briefly to confirm Caddy reloaded cleanly
docker logs khoai-caddy --tail 30
```

---

## Step 8 — Verify

### From your local browser:

`https://mws.kho-ai.com` should now show the default Next.js starter page (the Vercel/Next welcome screen) over HTTPS.

### From the command line:

```bash
# Should hit the Next.js healthcheck via Caddy → mws-web
curl -s https://mws.kho-ai.com/api/health
# {"status":"ok","commit":"<short-sha>","timestamp":"..."}

# Headers should show server: Caddy and HSTS set
curl -I https://mws.kho-ai.com
```

### Sanity check the umbrella is still happy:

```bash
curl -I https://kho-ai.com
curl -I https://api.kho-ai.com/health
curl -I https://avp.kho-ai.com
```

All three should still return `HTTP/2 200`.

---

## Step 9 — Trigger the first GitHub Actions deploy

Push any small change to `main` (or click **Actions → Deploy to VPS → Run workflow**). The workflow will:

1. SSH in as `deploy`.
2. `git fetch origin main && git reset --hard origin/main` in `~/apps/mws/`.
3. Rebuild the image with `GIT_COMMIT=<short-sha>` baked in.
4. Restart `mws-web` container.
5. Wait for healthcheck.
6. Prune dangling images.

After the workflow goes green, `curl https://mws.kho-ai.com/api/health` should now show `"commit": "<the-sha-you-pushed>"` instead of `"dev"`.

---

## Done — verification checklist

- [ ] `https://mws.kho-ai.com` loads the Next.js default welcome page (proves Caddy → mws-web reverse proxy works)
- [ ] `https://mws.kho-ai.com/api/health` returns JSON with a real commit SHA
- [ ] `docker ps | grep mws-web` shows `Up (healthy)`
- [ ] `docker logs mws-web --tail 30` shows `Ready in N ms` (Next.js startup)
- [ ] kho-ai unaffected: `https://kho-ai.com`, `https://api.kho-ai.com/health`, `https://auth.kho-ai.com` still 200
- [ ] AVP unaffected: `https://avp.kho-ai.com` still loads
- [ ] First successful GitHub Actions run on the `mws` repo (green checkmark on `main`)

When all are checked, Phase 1 is complete. Phase 2 layers Drizzle migrations and Auth.js on top — `mws-web` will start running schema migrations on container start, and the magic-link login flow becomes testable.

---

## Troubleshooting

**`docker compose build mws-web` fails with "network khoai not found":**
The `external` network in `docker-compose.prod.yml` resolves to `${KHOAI_NETWORK_NAME:-infrastructure_khoai-network}`. Confirm `KHOAI_NETWORK_NAME` is set in your `.env`:
```bash
grep KHOAI_NETWORK_NAME ~/apps/mws/.env
docker network ls | grep khoai-network
```
Make sure those match.

**Container starts but healthcheck never goes `healthy`:**
```bash
docker logs mws-web --tail 100
docker inspect --format '{{json .State.Health}}' mws-web | jq
```
Common causes: bad `DATABASE_URL` (Phase 2+ only — Phase 1 doesn't need DB), wrong `PORT` env, missing `.env` file, or `node server.js` not finding the standalone bundle (rebuild from scratch with `--no-cache`).

**`https://mws.kho-ai.com` returns 502 after Caddy flip:**
- `mws-web` container isn't running or isn't healthy yet.
- The Caddy container can't resolve `mws-web` because it's not on the same network. Check: `docker inspect khoai-caddy --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}'` should include the same network name as `mws-web`'s.
- The kho-ai Caddy was started before `mws-web` joined the network. Restart Caddy: `docker compose -f ~/apps/kho-ai/infrastructure/docker-compose.prod.yml restart caddy`.

**GitHub Actions deploy fails at `git reset --hard`:**
The repo wasn't cloned with the right SSH identity, or the deploy key on GitHub doesn't match. Re-check Step 3.

**Old placeholder still served after Caddy flip:**
Caddy reload didn't pick up the new block, or the browser/Cloudflare cached the old response.
- Hard-refresh the browser (Ctrl+F5).
- Purge Cloudflare cache for `mws.kho-ai.com` (CF dashboard → Caching → Configuration → Purge Everything for the zone, or use a per-URL purge).
- Recreate the Caddy container with `--force-recreate` (Step 7).

---

## Rollback

If the live container misbehaves and you need to flip back to the placeholder:

```bash
# 1. Stop the bad container
cd ~/apps/mws
docker compose -f docker-compose.prod.yml stop mws-web

# 2. Re-add the placeholder volume mount in kho-ai compose
nano ~/apps/kho-ai/infrastructure/docker-compose.prod.yml
# Add back: - /srv/mws/placeholder:/srv/mws:ro to the caddy service volumes

# 3. Restore the placeholder Caddy block
nano ~/apps/kho-ai/infrastructure/caddy/Caddyfile
# Replace the live block with the Phase 0 placeholder block (root + file_server)

# 4. Recreate Caddy
cd ~/apps/kho-ai/infrastructure
docker compose -f docker-compose.prod.yml up -d --force-recreate caddy
```

Customers see the under-construction page again, no errors. Fix the issue, run Steps 5–7 again.

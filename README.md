# MWS

Mississauga Wedding Solutions — Next.js 15 site, deployed on the kho-ai umbrella VPS.

- **Live preview:** https://mws.kho-ai.com
- **Production (after launch):** https://mississaugaweddsols.com
- **Plan:** [`docs/TECH_STACK_AND_PLAN.md`](docs/TECH_STACK_AND_PLAN.md)
- **VPS runbooks:** [`docs/PHASE_0_VPS_RUNBOOK.md`](docs/PHASE_0_VPS_RUNBOOK.md), [`docs/PHASE_1_VPS_FLIP.md`](docs/PHASE_1_VPS_FLIP.md)

## Local development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build (sanity-check before pushing)
pnpm start    # serve the built output locally
pnpm lint
```

Node 22 + pnpm 11 required. The `pnpm.onlyBuiltDependencies` block in `package.json` pre-approves `sharp` and `unrs-resolver` install scripts; if you hit `[ERR_PNPM_IGNORED_BUILDS]` on a fresh clone, run `pnpm approve-builds --all`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which SSHes into the kho-ai VPS as `deploy`, pulls latest, rebuilds the `mws-web` Docker image, and restarts the container. Healthcheck (`/api/health`) must report `healthy` within 90 s or the deploy fails.

### Required GitHub Actions secrets

| Secret | Value |
|---|---|
| `VPS_HOST` | `178.156.252.76` |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Contents of the existing kho-ai deploy private key (see kho-ai's `VPS_DEPLOYMENT_GUIDE.md` §13.1). The same key works for both repos. |

### VPS-side prerequisites

`~/apps/mws/` must exist with the repo cloned and a `.env` file present. See `docs/PHASE_1_VPS_FLIP.md` for the one-time setup.

## Project layout

```
src/app/                   Next.js App Router (pages, layouts, API routes)
src/app/api/health/        Healthcheck endpoint hit by Docker + GH Actions
public/                    Static assets served at root URL
_design/                   Design bundle from claude.ai/design (reference only, not bundled)
docs/                      Plan + VPS runbooks
Dockerfile                 Multi-stage prod image, output 'standalone'
docker-compose.prod.yml    mws-web service, joins kho-ai's external network
.github/workflows/         CI/CD
```

## Environment

See `.env.example`. On the VPS the live `.env` lives at `~/apps/mws/.env` (chmod 600).

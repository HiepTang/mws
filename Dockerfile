# syntax=docker/dockerfile:1.7
# Multi-stage Next.js production image leveraging `output: 'standalone'`.

ARG NODE_VERSION=22-alpine

# ─── deps ──────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

RUN corepack enable

# Copy only files needed for dependency resolution to maximise cache hits.
# `packageManager: pnpm@9.x` in package.json pins corepack to pnpm 9 inside
# this container, sidestepping pnpm 11's per-environment build-script approval
# gate (ERR_PNPM_IGNORED_BUILDS). pnpm 9 honours `pnpm.onlyBuiltDependencies`
# in package.json without the extra approval handshake.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── builder ───────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public env. `NEXT_PUBLIC_*` values are inlined into the client
# bundle by `next build`, so they must be present in the build environment —
# not just at runtime. Compose passes them via build.args (see
# docker-compose.prod.yml). Defaults to empty so the build still succeeds when
# the var is absent (e.g. local dev), and the Turnstile component renders its
# "spam check disabled" placeholder instead.
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

ARG NEXT_PUBLIC_SITE_URL="https://mws.kho-ai.com"
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Bundle the migration runner into a single file with all deps inlined.
# Turbopack inlines drizzle-orm + postgres into the Next.js chunks (great for
# the running app, but the standalone bundle's node_modules only ships next/
# react/react-dom). esbuild produces one self-contained file the runner stage
# can execute without a separate prod-install.
RUN pnpm exec esbuild scripts/migrate.mjs \
      --bundle \
      --platform=node \
      --target=node22 \
      --format=esm \
      --packages=bundle \
      --outfile=/app/dist/migrate.mjs

# ─── runner ────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user matching the standalone output's expectations.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone output bundles only what the server needs, plus the public/
# and static directories which Next looks for at runtime. Because the app
# imports `drizzle-orm` and `postgres` (via src/db), Next traces those into
# the standalone node_modules, so the migration runner below can resolve them
# from the same location without a separate prod-install step.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Bundled migration runner (self-contained — drizzle-orm + postgres inlined)
# plus the generated SQL migrations the runner reads.
COPY --from=builder --chown=nextjs:nodejs /app/dist/migrate.mjs ./migrate.mjs
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

USER nextjs

EXPOSE 3000

# Healthcheck hits the API route added in src/app/api/health/route.ts.
# 60s start period covers migrations + Next.js boot.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --spider --tries=1 http://127.0.0.1:3000/api/health || exit 1

# Apply pending migrations, then start the Next.js server. Migration failure
# exits non-zero and prevents the server from starting, so the container goes
# unhealthy and the deploy workflow fails fast instead of serving stale code.
CMD ["sh", "-c", "node migrate.mjs && exec node server.js"]

# syntax=docker/dockerfile:1.7
# Multi-stage Next.js production image leveraging `output: 'standalone'`.

ARG NODE_VERSION=22-alpine

# ─── deps ──────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

RUN corepack enable

# Copy only files needed for dependency resolution to maximise cache hits.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── builder ───────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

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
# and static directories which Next looks for at runtime.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Healthcheck hits the API route added in src/app/api/health/route.ts.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --quiet --spider --tries=1 http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]

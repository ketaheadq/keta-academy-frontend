FROM guergeiro/pnpm:20-10-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies
FROM base AS deps
WORKDIR /app
# Explicitly copy only known-safe files (avoid glob if possible)
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Exclude sensitive files via .dockerignore (ensure it exists!)
COPY . .

# Harden permissions: remove group/other write access
RUN chmod -R go-w ./

# Build arguments for environment variables
ARG NEXT_PUBLIC_STRAPI_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets (read-only)
COPY --from=builder /app/public ./public

# Copy built app files with ownership AND hardened permissions
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 🔒 CRITICAL: Remove write permissions in final image
RUN chmod -R go-w . \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
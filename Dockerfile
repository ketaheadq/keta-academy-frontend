FROM guergeiro/pnpm:20-10-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Create the user during image build
RUN corepack enable && \
  addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm run build

FROM base
# Copy the built application and production dependencies
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

# Change ownership during image build (happens once when building)
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]

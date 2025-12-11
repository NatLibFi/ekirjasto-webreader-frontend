FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@latest --activate

FROM base AS builder
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"]

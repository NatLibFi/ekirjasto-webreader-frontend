FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat \
    && corepack enable \
    && corepack prepare pnpm@latest --activate

FROM base AS builder
COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .

RUN pnpm build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder app/node_modules ./node_modules
COPY --from=builder app/package.json ./

COPY . .

RUN mkdir -p .next && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["npm", "dev"]
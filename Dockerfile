# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Program files loaded by fs.readFileSync at runtime (not bundled by Next.js standalone)
COPY --from=builder --chown=nextjs:nodejs /app/docs/exercises ./docs/exercises
COPY --from=builder --chown=nextjs:nodejs /app/docs/framework ./docs/framework
COPY --from=builder --chown=nextjs:nodejs /app/content/introductions ./content/introductions
COPY --from=builder --chown=nextjs:nodejs /app/content/posts ./content/posts

RUN mkdir -p /data/slides && chown nextjs:nodejs /data/slides

ENV STORAGE_PATH=/data/slides

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

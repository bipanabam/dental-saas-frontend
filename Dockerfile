FROM node:22-alpine AS base
WORKDIR /app

# -------------------------
# Dependencies
# -------------------------
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

# -------------------------
# Build
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env .env
RUN npm run build

# -------------------------
# Runtime
# -------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

EXPOSE 3000

CMD ["npm", "start"]
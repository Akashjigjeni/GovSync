# Multi-stage build for GovSync Backend API
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create persistent data directory for JSON DB
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "dist/index.js"]

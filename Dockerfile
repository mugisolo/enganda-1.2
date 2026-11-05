# ==============================================================================
# Stage 1: Build Frontend Assets with Vite
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application source and build production SPA bundle
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime for Google Cloud Run
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy production dependencies and built artifacts from builder stage
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server-data ./server-data
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

EXPOSE 8080

# Node 22 natively executes server.ts to serve both /api/* routes and /dist static assets
CMD ["npm", "run", "start"]

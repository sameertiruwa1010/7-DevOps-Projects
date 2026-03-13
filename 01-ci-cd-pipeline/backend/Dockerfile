FROM node:20-alpine AS base
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS final
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .
USER nodeuser
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1
CMD ["node", "server.js"]

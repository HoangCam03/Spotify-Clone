FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/api-gateway /app/services/api-gateway

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build api-gateway
WORKDIR /app/services/api-gateway
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy api-gateway package.json
COPY services/api-gateway/package.json /app/services/api-gateway/

WORKDIR /app/services/api-gateway
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/api-gateway/dist ./dist

EXPOSE 3000
CMD ["node", "dist/services/api-gateway/src/server.js"]


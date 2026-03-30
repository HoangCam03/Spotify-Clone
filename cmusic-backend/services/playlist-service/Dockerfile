FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/playlist-service /app/services/playlist-service

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build playlist-service
WORKDIR /app/services/playlist-service
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy project metadata
COPY services/playlist-service/package.json /app/services/playlist-service/

WORKDIR /app/services/playlist-service
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/playlist-service/dist ./dist

EXPOSE 3004
CMD ["node", "dist/services/playlist-service/src/server.js"]


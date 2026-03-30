FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/history-service /app/services/history-service

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build history-service
WORKDIR /app/services/history-service
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy project metadata
COPY services/history-service/package.json /app/services/history-service/

WORKDIR /app/services/history-service
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/history-service/dist ./dist

EXPOSE 3006
CMD ["node", "dist/services/history-service/src/server.js"]


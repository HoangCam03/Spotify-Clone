FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/catalog-service /app/services/catalog-service

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build catalog-service
WORKDIR /app/services/catalog-service
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy project metadata
COPY services/catalog-service/package.json /app/services/catalog-service/

WORKDIR /app/services/catalog-service
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/catalog-service/dist ./dist

EXPOSE 3003
CMD ["node", "dist/services/catalog-service/src/server.js"]


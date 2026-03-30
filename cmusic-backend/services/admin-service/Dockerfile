FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/admin-service /app/services/admin-service

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build admin-service
WORKDIR /app/services/admin-service
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy project metadata
COPY services/admin-service/package.json /app/services/admin-service/

WORKDIR /app/services/admin-service
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/admin-service/dist ./dist

EXPOSE 3008
CMD ["node", "dist/services/admin-service/src/server.js"]


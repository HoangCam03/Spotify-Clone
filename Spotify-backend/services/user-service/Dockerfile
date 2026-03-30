FROM node:20-alpine AS builder
WORKDIR /app
COPY libs /app/libs
COPY services/user-service /app/services/user-service

# Build libs
WORKDIR /app/libs
RUN npm install
RUN npm run build

# Build user-service
WORKDIR /app/services/user-service
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
# Copy libs source and metadata (needed for symlink in node_modules)
COPY libs /app/libs
# Copy project metadata
COPY services/user-service/package.json /app/services/user-service/

WORKDIR /app/services/user-service
# Install production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/libs/dist /app/libs/dist
COPY --from=builder /app/services/user-service/dist ./dist

EXPOSE 3002
CMD ["node", "dist/services/user-service/src/server.js"]


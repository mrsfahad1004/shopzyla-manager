FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache wget

# Copy package files and install dependencies (including express)
COPY package.json package-lock.json ./
RUN npm install 2>/dev/null || npm install --only=production 2>/dev/null || true

# Copy build output and server
COPY dist/ ./dist/
COPY server.cjs ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start server
CMD ["node", "server.cjs"]

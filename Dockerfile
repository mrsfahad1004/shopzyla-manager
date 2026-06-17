FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production 2>/dev/null; npm install express 2>/dev/null; ls node_modules/.package-lock.json 2>/dev/null

COPY dist/ ./dist/
COPY server.cjs ./
COPY railway.json ./

EXPOSE 3000

CMD ["node", "server.cjs"]

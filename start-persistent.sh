#!/bin/bash
# ShopZyla Persistent Startup Script
APP_DIR="/root/Documents/Codex/2026-06-12/i-have-connected-you-to-my/proper-manager/web/frontend"

# Kill old processes
fuser -k 3000/tcp 2>/dev/null
pkill -f "localtunnel" 2>/dev/null
pkill -f "tunnel-keepalive" 2>/dev/null
pkill -f "reconnect-tunnel" 2>/dev/null
pkill -f "pinggy" 2>/dev/null
sleep 2

# Start server
cd "$APP_DIR"
export PORT=3000
export SHOPIFY_ACCESS_TOKEN="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"
export SHOPIFY_STORE="gmxdth-9b"
export SHOPIFY_STORE_URL="https://gmxdth-9b.myshopify.com"
export SHOPIFY_API_KEY="8f7f32d0b4f52d20d2109b8eaf0f620c"
node server.cjs > /tmp/shopzyla-server.log 2>&1 &
echo "Server PID: $!"
sleep 2
echo "Server started: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)"

# Start Pinggy tunnel with auto-reconnect
while true; do
  echo "$(date): Starting Pinggy tunnel..."
  ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 \
    -o ExitOnForwardFailure=yes -o ConnectTimeout=10 \
    -R0:localhost:3000 a.pinggy.io 2>&1 | tee /tmp/pinggy-url.log
  echo "$(date): Tunnel disconnected, reconnecting in 5s..."
  sleep 5
done

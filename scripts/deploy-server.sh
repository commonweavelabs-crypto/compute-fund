#!/usr/bin/env bash
# compute-fund: one-command deploy (server + cloudflared tunnel + OAuth redirect sync)
# Laws: Stripe stays test-mode; tunnel = quick (ephemeral) until a named domain;
# the supabase redirect list is patched EVERY deploy (OAuth + rotating tunnels).
# Usage: bash scripts/deploy-with-tunnel.sh [port]
set -euo pipefail
PORT="${1:-8872}"
APP_DIR="$(cd "$(dirname "$0")/../app" && pwd)"
V0_ENV="$APP_DIR/../compute-fund-v0/.env.local"

cd "$APP_DIR"
[ -f .env.local ] || { echo "missing .env.local (run npm install + port steps first)"; exit 1; }

echo "[1/4] building..."
npm run build >/dev/null 2>&1
echo "  build green"

echo "[2/4] starting the server on :$PORT..."
if [ -f /tmp/cf-server.log ]; then kill "$(cat /tmp/cf-server.pid)" 2>/dev/null || true; fi
nohup npm run start -- -p "$PORT" >/tmp/cf-server.log 2>&1 &
echo $! > /tmp/cf-server.pid
sleep 6
curl -s -o /dev/null -w "  home: %{http_code}\n" "http://localhost:$PORT/"

echo "DONE (server). Next: start the tunnel, then run scripts/sync-oauth-redirects.sh <tunnel-url>"

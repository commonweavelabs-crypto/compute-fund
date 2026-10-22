#!/usr/bin/env bash
# sync-oauth-redirects.sh <public-url> — append the tunnel + localhost to the
# supabase OAuth redirect list (github provider; rotating tunnels = re-sync per
# deploy). Never clobbers: merges; site_url untouched.
set -euo pipefail
URL="${1:?usage: sync-oauth-redirects.sh <public-url>}"
APP_DIR="$(cd "$(dirname "$0")/../app" && pwd)"
V0_ENV="$APP_DIR/../compute-fund-v0/.env.local"
SUPA_URL=$(grep -oE '^NEXT_PUBLIC_SUPABASE_URL=.*' "$V0_ENV" | head -1 | cut -d= -f2-)
ACCESS=$(grep -oE '^SUPABASE_ACCESS_TOKEN=.*' "$V0_ENV" | head -1 | cut -d= -f2-)
REF=$(echo "$SUPA_URL" | sed -E 's#https://([^.]+)\.supabase.*##')
C:/Python313/python.exe "$APP_DIR/scripts/sync_redirects.py" "$REF" "$ACCESS" "$URL"

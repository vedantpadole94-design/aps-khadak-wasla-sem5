#!/bin/bash
ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "════════════════════════════════════════"
echo "   APS PROJECT — LOCAL SETUP CHECK"
echo "════════════════════════════════════════"
echo ""
echo "1. Checking backend environment..."
cd "$ROOT/backend" || exit 1
if [ ! -f .env ]; then
  cp .env.example .env
  echo "   Created backend/.env from the example. Add a strong JWT_SECRET and configure MONGODB_URI."
fi
node validateEnv.js || exit 1
echo "2. Ensuring frontend development API URL..."
if [ ! -f "$ROOT/frontend/.env" ]; then
  printf '%s\n' "VITE_API_URL=http://localhost:5001/api" > "$ROOT/frontend/.env"
fi
echo "   Frontend environment file is ready."
echo ""
echo "════════════════════════════════════════"
echo "   Setup check complete"
echo "════════════════════════════════════════"
echo ""
echo "Open TWO terminals and run:"
echo "  Terminal 1:  $ROOT/start-backend.sh"
echo "  Terminal 2:  $ROOT/start-frontend.sh"
echo "To seed or reset an admin, set ADMIN_USERNAME and ADMIN_PASSWORD in backend/.env first."
echo ""

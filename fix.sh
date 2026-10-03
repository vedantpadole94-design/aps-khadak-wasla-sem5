#!/bin/bash
ROOT="/Users/vedant77/Desktop/aps khadakwasla project/aps-khadakwasla"
echo "════════════════════════════════════════"
echo "   APS PROJECT — FULL RESET & START"
echo "════════════════════════════════════════"
echo ""
echo "1️⃣  Killing all node processes..."
killall node 2>/dev/null
sleep 2
echo "2️⃣  Ensuring backend .env has PORT..."
cd "$ROOT/backend" || exit 1
grep -q "^PORT=" .env || echo "PORT=5001" >> .env
grep -q "^MONGODB_URI=" .env || echo "MONGODB_URI=mongodb://127.0.0.1:27017/aps_khadakwasla" >> .env
grep -q "^JWT_SECRET=" .env || echo "JWT_SECRET=aps-khadakwasla-super-secret-jwt-key-2024-local-dev" >> .env
grep -q "^ADMIN_USERNAME=" .env || echo "ADMIN_USERNAME=admin" >> .env
grep -q "^ADMIN_PASSWORD=" .env || echo "ADMIN_PASSWORD=aps123" >> .env
grep -q "^CORS_ORIGIN=" .env || echo "CORS_ORIGIN=http://localhost:5173" >> .env
echo "   ✅ .env verified"
echo "3️⃣  Ensuring frontend .env..."
[ -f "$ROOT/frontend/.env" ] || echo "VITE_API_URL=http://localhost:5001/api" > "$ROOT/frontend/.env"
echo "   ✅ frontend .env verified"
echo "4️⃣  Resetting admin password..."
npm run reset:admin > /dev/null 2>&1
echo "   ✅ admin / aps123 ready"
echo ""
echo "════════════════════════════════════════"
echo "   ✅ READY TO START"
echo "════════════════════════════════════════"
echo ""
echo "Open TWO terminals and run:"
echo "  Terminal 1:  $ROOT/start-backend.sh"
echo "  Terminal 2:  $ROOT/start-frontend.sh"
echo ""

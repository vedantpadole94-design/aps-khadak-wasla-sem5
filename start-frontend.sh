#!/bin/bash
cd "$(dirname "$0")/frontend" || exit 1
if [ ! -f .env ]; then
  echo "VITE_API_URL=http://localhost:5001/api" > .env
  echo "✅ Created frontend .env"
fi
echo "🧹 Cleaning up old processes..."
lsof -ti :5173 | xargs kill -9 2>/dev/null
sleep 1
echo "🚀 Starting frontend on port 5173..."
npm run dev

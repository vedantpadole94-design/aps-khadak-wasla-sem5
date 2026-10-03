#!/bin/bash
cd "$(dirname "$0")/backend" || exit 1
echo "🔍 Checking environment..."
node validateEnv.js || exit 1
echo ""
echo "🧹 Cleaning up old processes..."
lsof -ti :5001 | xargs kill -9 2>/dev/null
sleep 1
echo "🚀 Starting backend on port 5001..."
npm run dev

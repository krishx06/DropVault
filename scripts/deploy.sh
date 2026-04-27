#!/bin/bash
set -e

APP_DIR="${APP_DIR:-/home/ubuntu/DropVault}"
PM2_APP_NAME="${PM2_APP_NAME:-dropvault-backend}"

echo "==> Deploying DropVault from $APP_DIR"

# Pull latest code
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main

# Backend: install and build
cd "$APP_DIR/backend"
npm ci --prefer-offline
npx prisma generate
npm run build

# Reload backend process (start it if it doesn't exist yet — idempotent)
if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
  pm2 reload "$PM2_APP_NAME" --update-env
else
  NODE_ENV=production pm2 start dist/server.js --name "$PM2_APP_NAME"
fi

pm2 save

echo "==> Deploy complete"

#!/bin/bash

# Deployment script for Bunta-Bella Irrigation System
# This script should be run after pulling updates from GitHub

set -e  # Exit on any error

echo "🚀 Starting deployment process for Bunta-Bella Irrigation System"
echo "=============================================================="

# Step 1: Install root dependencies (if any)
echo "📦 Step 1: Installing root dependencies..."
npm install 2>/dev/null || echo "  No root dependencies to install."

# Step 2: Install backend dependencies
echo "📦 Step 2: Installing backend dependencies..."
cd backend && npm install && cd ..

# Step 3: Install frontend dependencies
echo "📦 Step 3: Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Step 4: Generate Prisma client
echo "🔧 Step 4: Generating Prisma client..."
npx prisma generate --schema=backend/prisma/schema.prisma

# Step 5: Run database migrations
echo "🗄️ Step 5: Running database migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

# Step 6: Fix upload directories
echo "📁 Step 6: Setting up upload directories..."
node backend/scripts/fix-upload-directories.js

# Step 7: Seed the database (all-in-one)
echo "🌱 Step 7: Seeding database with comprehensive data..."
cd backend && npm run seed && cd ..

# Step 8: Optional data verification
if [ -f "backend/scripts/check-data.js" ]; then
    echo "🔍 Step 8: Running data consistency check..."
    node backend/scripts/check-data.js
fi

# Step 9: Build the frontend application
echo "🏗️ Step 9: Building frontend application..."
cd frontend && npm run build && cd ..

# Step 10: Restart PM2 processes
echo "🔄 Step 10: Restarting PM2 processes..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
    pm2 save
    echo "✅ PM2 processes restarted successfully."
else
    echo "⚠️ PM2 not found. Please start the services manually:"
    echo "   Backend:  cd backend && node src/index.js"
    echo "   Frontend: cd frontend && npm start"
fi

echo ""
echo "=============================================================="
echo "✅ Deployment completed successfully at $(date)"
echo "=============================================================="
echo ""
echo "📋 Services:"
echo "   - Frontend: https://irigasibunta.com"
echo "   - Backend:  https://be.irigasibunta.com"
echo ""
echo "📋 Management commands:"
echo "   - View logs:      pm2 logs"
echo "   - Monitor:        pm2 monit"
echo "   - Restart:        pm2 restart all"
echo "   - Status:         pm2 status"
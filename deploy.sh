#!/bin/bash

# Deployment script for Bunta-Bella Irrigation System
# This script should be run after pulling updates from GitHub

set -e  # Exit on any error

echo "🚀 Starting deployment process for Bunta-Bella Irrigation System"
echo "=============================================================="

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install

# Step 2: Generate Prisma client
echo "🔧 Step 2: Generating Prisma client..."
npx prisma generate --schema=backend/prisma/schema.prisma

# Step 3: Run database migrations
echo "🗄️ Step 3: Running database migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

# Step 4: Fix upload directories
echo "📁 Step 4: Setting up upload directories..."
node backend/scripts/fix-upload-directories.js

# Step 5: Seed the database (all-in-one)
echo "🌱 Step 5: Seeding database with comprehensive data..."
npm run seed

# Step 6: Optional data verification
if [ -f "backend/scripts/check-data.js" ]; then
    echo "🔍 Step 6: Running data consistency check..."
    node backend/scripts/check-data.js
fi

# Step 6: Build the application
echo "🏗️ Step 6: Building application..."
npm run build

# Step 7: Restart the application (this part depends on your deployment setup)
echo "🔄 Step 7: Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   - If using PM2: pm2 restart bunta-bella-irrigation"
echo "   - If using systemd: sudo systemctl restart bunta-bella-irrigation"
echo "   - If using Docker: docker-compose up -d --build"
echo ""
echo "✅ Deployment script finished at $(date)"
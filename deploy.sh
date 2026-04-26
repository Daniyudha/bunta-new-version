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

# Step 4: Generate Prisma client for backend
echo "🔧 Step 4: Generating Prisma client..."
cd backend && npx prisma generate && cd ..

# Step 5: Run database migrations
echo "🗄️ Step 5: Running database migrations..."
cd backend && npx prisma migrate deploy && cd ..

# Step 6: Fix upload directories
echo "📁 Step 6: Setting up upload directories..."
node backend/scripts/fix-upload-directories.js || echo "  ⚠️ Upload directory script skipped."

# Step 7: Seed the database (all-in-one)
echo "🌱 Step 7: Seeding database with comprehensive data..."
cd backend && npm run seed || echo "  ⚠️ Seed script skipped (may already have data)." && cd ..

# Step 8: Optional data verification
if [ -f "backend/scripts/check-data.js" ]; then
    echo "🔍 Step 8: Running data consistency check..."
    node backend/scripts/check-data.js || echo "  ⚠️ Data check completed with warnings."
fi

# Step 9: Build the frontend application
echo "🏗️ Step 9: Building frontend application..."
cd frontend && npm run build && cd ..

# Step 10: Copy environment files for production
echo "🔐 Step 10: Setting up production environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.production backend/.env
    echo "  ✅ Backend .env created from .env.production"
else
    echo "  ⚠️ Backend .env already exists, skipping copy"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.production frontend/.env
    echo "  ✅ Frontend .env created from .env.production"
else
    echo "  ⚠️ Frontend .env already exists, skipping copy"
fi

# Step 11: Restart PM2 processes
echo "🔄 Step 11: Restarting PM2 processes..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js --env production || pm2 start ecosystem.config.js --env production
    pm2 save
    echo "✅ PM2 processes restarted successfully."
else
    echo "⚠️ PM2 not found. Please start the services manually:"
    echo "   Backend:  cd backend && node src/index.js"
    echo "   Frontend: cd frontend && npm start"
fi

# Step 12: Verify services are running
echo "🔍 Step 12: Verifying services..."
sleep 3
if command -v curl &> /dev/null; then
    echo "  Checking backend health..."
    curl -s -o /dev/null -w "  Backend health: %{http_code}\n" http://localhost:5001/api/health || echo "  ⚠️ Backend health check failed"
    echo "  Checking API docs..."
    curl -s -o /dev/null -w "  API Docs: %{http_code}\n" http://localhost:5001/api-docs || echo "  ⚠️ API docs check failed"
fi

echo ""
echo "=============================================================="
echo "✅ Deployment completed successfully at $(date)"
echo "=============================================================="
echo ""
echo "📋 Services:"
echo "   - Frontend: https://irigasibunta.com"
echo "   - Backend:  https://be.irigasibunta.com"
echo "   - API Docs: https://be.irigasibunta.com/api-docs"
echo ""
echo "📋 Management commands:"
echo "   - View logs:      pm2 logs"
echo "   - Monitor:        pm2 monit"
echo "   - Restart:        pm2 restart all"
echo "   - Status:         pm2 status"
echo ""
echo "📋 Domain Configuration:"
echo "   - Frontend (Next.js) runs on localhost:3000"
echo "   - Backend (Express)  runs on localhost:5001"
echo "   - Nginx proxies irigasibunta.com → Frontend"
echo "   - Nginx proxies be.irigasibunta.com → Backend"

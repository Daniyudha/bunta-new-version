#!/bin/bash
# deploy-production-fixes.sh
# Run this script on the PRODUCTION server to deploy all recent fixes:
#   1. Contact Submission PATCH fix (Express route)
#   2. Frontend rebuild with unoptimized: true (fix image 400 error)
#   3. New "Manajemen Lokasi" create/edit pages
#   4. Icon button style consistency
#   5. Fix database migration (resolve rolled-back + apply new migration)
#   6. Re-run seed
#
# Usage: bash deploy-production-fixes.sh
#
# Assumes the project is at: /root/fauzi-ridwan/bunta-new-version

set -e

PROJECT_DIR="/root/fauzi-ridwan/bunta-new-version"

echo "=============================================================="
echo "  Bunta Bella Irrigation - Production Fix Deployment"
echo "=============================================================="
echo ""

# ----------------------------------------------------------------
# Step 0: Verify we're on the production server
# ----------------------------------------------------------------
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory not found at $PROJECT_DIR"
    echo "   Are you running this on the production server?"
    exit 1
fi

cd "$PROJECT_DIR"
echo "✅ Project found at $PROJECT_DIR"
echo ""

# ----------------------------------------------------------------
# Step 1: Pull latest code (if using Git)
# ----------------------------------------------------------------
echo "📥 Step 1/6: Pulling latest code..."
if [ -d ".git" ]; then
    git pull origin main
    echo "   ✅ Git pull complete"
else
    echo "   ⚠️ Not a git repository — make sure you've copied all updated files manually."
    echo "     Files that must be updated:"
    echo "     - backend/src/routes/admin/contact-submissions.js"
    echo "     - frontend/next.config.ts"
    echo "     - frontend/src/app/admin/data/locations/LocationsManagementClient.tsx"
    echo "     - frontend/src/app/admin/data/locations/create/*"
    echo "     - frontend/src/app/admin/data/locations/edit/*"
    echo "     - frontend/src/app/admin/farmer-groups/FarmerGroupsClient.tsx"
fi
echo ""

# ----------------------------------------------------------------
# Step 2: Restart Backend (apply contact-submissions PATCH fix)
# ----------------------------------------------------------------
echo "🔄 Step 2/6: Restarting backend (bunta-backend)..."
if pm2 describe bunta-backend &>/dev/null; then
    pm2 restart bunta-backend
    echo "   ✅ Backend restarted"
else
    echo "   ⚠️ bunta-backend not found in PM2. Starting it..."
    cd backend && pm2 start src/index.js --name bunta-backend && cd "$PROJECT_DIR"
fi
echo ""

# ----------------------------------------------------------------
# Step 3: Rebuild Frontend (apply unoptimized: true + new pages)
# ----------------------------------------------------------------
echo "🏗️ Step 3/6: Rebuilding frontend..."
cd frontend
npm run build
pm2 restart bunta-frontend 2>/dev/null || echo "   ⚠️ bunta-frontend not running, skipping restart"
cd "$PROJECT_DIR"
echo "   ✅ Frontend rebuilt"
echo ""

# ----------------------------------------------------------------
# Step 4: Fix Database Migration
# ----------------------------------------------------------------
echo "🗄️ Step 4/6: Fixing database migration..."
cd backend

# Check migration status
echo "   Checking current migration status..."
MIGRATION_STATUS=$(npx prisma migrate status 2>&1)

if echo "$MIGRATION_STATUS" | grep -q "20260504200000_add_missing_schema_columns"; then
    if echo "$MIGRATION_STATUS" | grep -q "not yet been applied"; then
        echo "   ⚠️ Migration 20260504200000_add_missing_schema_columns is pending."
        echo "   Resolving as rolled-back (since schema is already applied)..."
        npx prisma migrate resolve --rolled-back 20260504200000_add_missing_schema_columns || true
    fi
fi

# Now apply all pending migrations
echo "   Applying pending migrations..."
npx prisma migrate deploy
echo "   ✅ Migrations applied successfully"

cd "$PROJECT_DIR"
echo ""

# ----------------------------------------------------------------
# Step 5: Re-run Seed
# ----------------------------------------------------------------
echo "🌱 Step 5/6: Seeding database..."
cd backend
node scripts/seed-all-in-one.js
echo "   ✅ Seed complete"
cd "$PROJECT_DIR"
echo ""

# ----------------------------------------------------------------
# Step 6: Final Verification
# ----------------------------------------------------------------
echo "🔍 Step 6/6: Verification..."
echo ""
echo "   PM2 Process Status:"
pm2 list
echo ""

# Quick health checks
sleep 2
echo "   Backend health check:"
curl -s -o /dev/null -w "   HTTP %{http_code}\n" http://localhost:5001/api/health 2>/dev/null || echo "   ⚠️ Backend health check failed"

echo ""
echo "=============================================================="
echo "  ✅ All production fixes deployed successfully!"
echo "=============================================================="
echo ""
echo "   Verify these features on https://irigasibunta.com:"
echo "   ├─ Images loading (uploads/*)"
echo "   ├─ Contact Submission → change status"
echo "   ├─ Manajemen Lokasi → create / edit / delete"
echo "   ├─ Kelompok Tani → action button icons"
echo "   └─ Seed data populated"
echo ""
echo "   To check logs if something is wrong:"
echo "   ├─ pm2 logs bunta-backend --lines 30"
echo "   └─ pm2 logs bunta-frontend --lines 30"
echo ""

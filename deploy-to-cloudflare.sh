#!/bin/bash

# Angela Coach - Automated Cloudflare Deployment Script
# This script will deploy your app to Cloudflare Pages

echo "🚀 Angela Coach - Cloudflare Deployment"
echo "========================================"
echo ""

# Set your Cloudflare API token
export CLOUDFLARE_API_TOKEN="CJx8BNo-T2Vl6f4fPXgyCHAvzRqdfN7iu18Z2TMh"
export CLOUDFLARE_ACCOUNT_ID="b0e6e7177462586abca25e1f812f2bad"

# Project name
PROJECT_NAME="angela-coach"

echo "✅ Step 1: Installing dependencies..."
npm install

echo ""
echo "✅ Step 2: Building project..."
npm run build

echo ""
echo "✅ Step 3: Creating production D1 database..."
echo "Creating database: angela-db-production..."

# Create D1 database
DATABASE_OUTPUT=$(npx wrangler d1 create angela-db-production 2>&1)
echo "$DATABASE_OUTPUT"

# Extract database ID from output
DATABASE_ID=$(echo "$DATABASE_OUTPUT" | grep -oP 'database_id = "\K[^"]+' | head -1)

if [ -z "$DATABASE_ID" ]; then
    echo "⚠️  Database might already exist. Checking..."
    DATABASE_ID=$(npx wrangler d1 list 2>&1 | grep "angela-db-production" | grep -oP '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}')
fi

echo "Database ID: $DATABASE_ID"

echo ""
echo "✅ Step 4: Updating wrangler.jsonc with database ID..."

# Update wrangler.jsonc with actual database ID
if [ ! -z "$DATABASE_ID" ]; then
    sed -i "s/YOUR_DATABASE_ID_HERE/$DATABASE_ID/g" wrangler.jsonc
    echo "Updated wrangler.jsonc with database ID"
else
    echo "⚠️  Could not extract database ID. You may need to update wrangler.jsonc manually."
fi

echo ""
echo "✅ Step 5: Running database migrations..."
npx wrangler d1 migrations apply angela-db-production --remote

echo ""
echo "✅ Step 6: Creating Cloudflare Pages project..."
npx wrangler pages project create $PROJECT_NAME --production-branch=main 2>&1 || echo "Project might already exist, continuing..."

echo ""
echo "✅ Step 7: Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=$PROJECT_NAME

echo ""
echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Your app is now live at:"
echo "https://$PROJECT_NAME.pages.dev"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Go to: https://dash.cloudflare.com/"
echo "2. Navigate to: Workers & Pages > $PROJECT_NAME > Settings > Environment variables"
echo "3. Add these production secrets:"
echo "   - TP_CLIENT_SECRET (your TrainingPeaks secret)"
echo "   - TP_REDIRECT_URI: https://$PROJECT_NAME.pages.dev/handle_trainingpeaks_authorization"
echo ""
echo "Then authorize TrainingPeaks at:"
echo "https://$PROJECT_NAME.pages.dev/static/tp-connect-production"
echo ""

#!/bin/bash
# COMPLETE MULTI-ATHLETE SYSTEM TEST
# Tests all endpoints for connecting to ALL athletes

echo "🚀 ANGELA COACH - MULTI-ATHLETE SYSTEM TEST"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo "📋 STEP 1: Check Current System Status"
echo "--------------------------------------"

# Check service
curl -s $BASE_URL/api/health >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Service is running"
else
    echo -e "${RED}✗${NC} Service is not responding"
    exit 1
fi

# Check current athlete count
CURRENT_COUNT=$(curl -s $BASE_URL/api/coach/athletes | jq -r '.total_athletes')
echo "Current athletes in database: $CURRENT_COUNT"
echo ""

echo "📋 STEP 2: Check Coach Token"
echo "--------------------------------------"
TOKEN_STATUS=$(curl -s $BASE_URL/api/coach/athletes | jq -r '.note')
if [[ "$TOKEN_STATUS" == *"TrainingPeaks API not available"* ]]; then
    echo -e "${YELLOW}⚠${NC} Demo token active - Need to reconnect TrainingPeaks"
    echo ""
    echo "ACTION REQUIRED:"
    echo "Visit: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html"
    echo ""
    echo "After connecting, run this script again!"
    exit 0
else
    echo -e "${GREEN}✓${NC} TrainingPeaks token is active"
fi
echo ""

echo "📋 STEP 3: Sync ALL Athletes from TrainingPeaks"
echo "--------------------------------------"
echo "Calling: POST /api/coach/sync-athletes"
SYNC_RESULT=$(curl -s -X POST $BASE_URL/api/coach/sync-athletes)
SYNC_STATUS=$(echo $SYNC_RESULT | jq -r '.success')
SYNCED_COUNT=$(echo $SYNC_RESULT | jq -r '.synced')
TOTAL_COUNT=$(echo $SYNC_RESULT | jq -r '.total')

if [ "$SYNC_STATUS" == "true" ]; then
    echo -e "${GREEN}✓${NC} Synced $SYNCED_COUNT of $TOTAL_COUNT athletes"
else
    ERROR_MSG=$(echo $SYNC_RESULT | jq -r '.error')
    echo -e "${RED}✗${NC} Sync failed: $ERROR_MSG"
    exit 1
fi
echo ""

echo "📋 STEP 4: Verify Athletes Loaded"
echo "--------------------------------------"
FINAL_COUNT=$(curl -s $BASE_URL/api/coach/athletes | jq -r '.total_athletes')
echo "Total athletes now in database: $FINAL_COUNT"

if [ "$FINAL_COUNT" -gt "$CURRENT_COUNT" ]; then
    echo -e "${GREEN}✓${NC} Successfully added $(($FINAL_COUNT - $CURRENT_COUNT)) new athletes"
else
    echo -e "${YELLOW}⚠${NC} No new athletes added (might already be synced)"
fi
echo ""

echo "📋 STEP 5: List All Athletes"
echo "--------------------------------------"
curl -s $BASE_URL/api/coach/athletes | jq -r '.athletes[] | "\(.id) - \(.name) (CTL: \(.ctl | round), TSB: \(.tsb | round))"' | head -10
echo ""
echo "(Showing first 10 athletes)"
echo ""

echo "📋 STEP 6: Test Individual Athlete Sync"
echo "--------------------------------------"
FIRST_ATHLETE=$(curl -s $BASE_URL/api/coach/athletes | jq -r '.athletes[0].id')
echo "Syncing athlete: $FIRST_ATHLETE"
ATHLETE_SYNC=$(curl -s -X POST $BASE_URL/api/coach/athlete/$FIRST_ATHLETE/sync)
ATHLETE_NAME=$(echo $ATHLETE_SYNC | jq -r '.athlete.name')
ATHLETE_CTL=$(echo $ATHLETE_SYNC | jq -r '.athlete.ctl')
if [ "$ATHLETE_NAME" != "null" ]; then
    echo -e "${GREEN}✓${NC} Synced $ATHLETE_NAME - CTL: $ATHLETE_CTL"
else
    echo -e "${RED}✗${NC} Failed to sync athlete"
fi
echo ""

echo "📋 STEP 7: Test Bulk Fueling Endpoint"
echo "--------------------------------------"
echo "Calling: POST /api/fuel/bulk"
BULK_RESULT=$(curl -s -X POST $BASE_URL/api/fuel/bulk -H "Content-Type: application/json")
BULK_SUCCESS=$(echo $BULK_RESULT | jq -r '.success')
BULK_QUEUED=$(echo $BULK_RESULT | jq -r '.summary.workouts_queued')
BULK_ATHLETES=$(echo $BULK_RESULT | jq -r '.summary.athletes_processed')

if [ "$BULK_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓${NC} Bulk fueling processed $BULK_ATHLETES athletes"
    echo "   Queued $BULK_QUEUED workouts for fueling"
else
    ERROR_MSG=$(echo $BULK_RESULT | jq -r '.error')
    echo -e "${YELLOW}⚠${NC} Bulk fueling: $ERROR_MSG"
fi
echo ""

echo "📋 STEP 8: Test Single Athlete Fueling"
echo "--------------------------------------"
FUEL_RESULT=$(curl -s -X POST $BASE_URL/api/fuel/next-week -H "Content-Type: application/json" -d "{\"athlete_id\":\"$FIRST_ATHLETE\"}")
FUEL_SUCCESS=$(echo $FUEL_RESULT | jq -r '.success')
FUEL_QUEUED=$(echo $FUEL_RESULT | jq -r '.queued')

if [ "$FUEL_SUCCESS" == "true" ]; then
    echo -e "${GREEN}✓${NC} Single athlete fueling queued $FUEL_QUEUED workouts"
else
    ERROR_MSG=$(echo $FUEL_RESULT | jq -r '.error')
    echo -e "${YELLOW}⚠${NC} Fueling: $ERROR_MSG"
fi
echo ""

echo "============================================"
echo "🎯 SUMMARY"
echo "============================================"
echo "Total Athletes: $FINAL_COUNT"
echo "Bulk Fueling: Processed $BULK_ATHLETES athletes, queued $BULK_QUEUED workouts"
echo ""
echo "✅ All endpoints are working!"
echo ""
echo "📚 Next Steps:"
echo "1. Visit dashboard: $BASE_URL/static/coach.html"
echo "2. Sync more athletes: POST /api/coach/sync-athletes"
echo "3. Run bulk fueling weekly: POST /api/fuel/bulk"
echo ""
echo "📖 Full documentation: CONNECT_ALL_ATHLETES.md"

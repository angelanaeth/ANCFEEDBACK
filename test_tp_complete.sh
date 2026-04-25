#!/bin/bash
# Complete TrainingPeaks Fuel Write-Back Test
# Works for ANY athlete, ANY coach

echo "🧪 TRAININGPEAKS FUEL WRITE-BACK TEST"
echo "======================================"
echo ""

# Test with athlete 1958448 (the one showing in your browser)
ATHLETE_ID="1958448"
BASE_URL="https://5000-i8mf68r87mlc4fo6mi2yb-5634da27.sandbox.novita.ai"

echo "Testing with Athlete ID: $ATHLETE_ID"
echo ""

echo "Step 1: Check Fuel Queue (Dashboard should show this)..."
QUEUE_RESULT=$(curl -s ${BASE_URL}/api/fuel/queue/${ATHLETE_ID})
echo "$QUEUE_RESULT" | jq -r 'if .count > 0 then "✅ Found \(.count) workouts in queue" else "❌ No workouts in queue - run fuel calculation first" end'
echo ""

echo "Step 2: Calculate Fuel for Next Week (if needed)..."
FUEL_RESULT=$(curl -s -X POST ${BASE_URL}/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}")

echo "$FUEL_RESULT" | jq -r 'if .success then "✅ Calculated fuel for \(.total_planned) workouts" else "❌ Error: \(.error)" end'
echo ""

echo "Step 3: Write CHO to TrainingPeaks Pre-Activity Comments..."
TP_RESULT=$(curl -s -X POST ${BASE_URL}/api/fuel/write-to-tp \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}")

echo "$TP_RESULT" | jq '.'
echo ""

echo "=========================================="
echo "🎯 EXPECTED RESULTS:"
echo ""
echo "✅ Synced X workouts to TrainingPeaks"
echo "✅ Each workout now has Pre-Activity Comments:"
echo "   'Echodevo Fuel: XXXg CHO'"
echo ""
echo "📱 CHECK IN TRAININGPEAKS:"
echo "1. Open TrainingPeaks for athlete ${ATHLETE_ID}"
echo "2. Look at upcoming workouts (next 7 days)"
echo "3. Open any workout"
echo "4. Check Pre-Activity Comments field"
echo "5. Should see: 'Echodevo Fuel: 350g CHO' (or similar)"
echo ""
echo "🔧 IF IT FAILS:"
echo "- Make sure you're connected to TrainingPeaks"
echo "- Verify you have 'workouts:plan' OAuth scope"
echo "- Check that workouts exist in TrainingPeaks calendar"

#!/bin/bash
# Test TrainingPeaks Fuel Write-Back

ATHLETE_ID="427194"
BASE_URL="http://localhost:5000"

echo "🧪 TESTING TRAININGPEAKS FUEL WRITE-BACK"
echo "=========================================="
echo ""

echo "Step 1: Calculate Fuel for Next Week..."
FUEL_RESULT=$(curl -s -X POST ${BASE_URL}/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}")

echo "$FUEL_RESULT" | jq -r '"✅ Calculated fuel for \(.total_planned) workouts (\(.queued) queued, \(.updated) updated)"'
echo ""

echo "Step 2: Write CHO Values to TrainingPeaks..."
TP_RESULT=$(curl -s -X POST ${BASE_URL}/api/fuel/write-to-tp \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}")

echo "$TP_RESULT" | jq '.'
echo ""

echo "=========================================="
echo "🎉 TEST COMPLETE!"
echo ""
echo "Check TrainingPeaks workouts for athlete ${ATHLETE_ID}"
echo "Pre-Activity Comments should now show: 'Echodevo Fuel: XXXg CHO'"

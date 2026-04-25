#!/bin/bash

echo "=== TESTING ALWAYS RE-FUEL BEHAVIOR ==="
echo ""
echo "📋 Simulating clicking 'Fuel' button multiple times..."
echo "   Each click should ALWAYS re-calculate and update workouts"
echo ""

ATHLETE_ID="427194"
BASE_URL="http://localhost:3000"

for i in 1 2 3; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Click #${i}: Fuel Button Clicked"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  RESPONSE=$(curl -s -X POST "${BASE_URL}/api/fuel/next-week" \
    -H "Content-Type: application/json" \
    -d "{\"athlete_id\": \"${ATHLETE_ID}\"}")
  
  echo "$RESPONSE" | jq '{
    success,
    queued,
    updated,
    total_planned,
    week_range,
    message
  }'
  
  echo ""
  sleep 1
done

echo "✅ TEST RESULTS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Each click should show:"
echo "  • queued: 0 (workouts already exist)"
echo "  • updated: 2 (ALWAYS updates existing)"
echo "  • message: '✅ Fueling 2 workouts...'"
echo ""
echo "This means: Clicking Fuel button ALWAYS re-calculates,"
echo "            even if workouts were already processed."
echo ""


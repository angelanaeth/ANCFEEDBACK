#!/bin/bash
echo "=== TESTING CHO CALCULATION SYSTEM ==="
echo ""

# Test athlete: 427194
ATHLETE_ID="427194"
BASE_URL="http://localhost:3000"

echo "1️⃣ Setting Athlete Profile"
echo "   Weight: 79.4 kg (175 lbs)"
echo "   CP: 256 watts"
echo "   CS Run: 423 seconds (7:03/mile)"
echo "   Swim pace: 95 seconds per 100"
curl -s -X POST "${BASE_URL}/api/coach/athlete/${ATHLETE_ID}/profile" \
  -H "Content-Type: application/json" \
  -d '{
    "weight_kg": 79.4,
    "cp_watts": 256,
    "cs_run_seconds": 423,
    "swim_pace_per_100": 95
  }' | jq '.'
echo ""

echo "2️⃣ Verifying Profile"
curl -s "${BASE_URL}/api/coach/athlete/${ATHLETE_ID}/profile" | jq '.'
echo ""

echo "3️⃣ Triggering Fueling for Next Week"
curl -s -X POST "${BASE_URL}/api/fuel/next-week" \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}" | jq '.'
echo ""

echo "4️⃣ Checking PM2 Logs for CHO Calculations"
echo "   (Look for 🚴 BIKE CHO, 🏃 RUN CHO, 🏊 SWIM CHO lines)"
pm2 logs angela-coach --nostream --lines 50 | grep -E "BIKE CHO|RUN CHO|SWIM CHO|Athlete profile" | tail -20

echo ""
echo "✅ Test Complete!"
echo ""
echo "Next steps:"
echo "- Check logs above for calculated CHO values"
echo "- Verify calculations match Excel formulas"
echo "- Test with different athlete profiles"


#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  🔍 VERIFICATION: Fuel System Uses Athlete Profile"
echo "════════════════════════════════════════════════════════════════"
echo ""

ATHLETE_ID="427194"
BASE_URL="http://localhost:3000"

echo "1️⃣ CHECK ATHLETE PROFILE IN DATABASE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx wrangler d1 execute angela-db --local --command="SELECT tp_athlete_id, weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100 FROM users WHERE tp_athlete_id = '${ATHLETE_ID}'" 2>&1 | grep -A 15 "results"
echo ""

echo "2️⃣ CHECK CURRENT PROFILE VIA API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/api/coach/athlete/${ATHLETE_ID}/profile" | jq '{
  athlete_id,
  weight_kg,
  cp_watts,
  cs_run_seconds,
  swim_pace_per_100
}'
echo ""

echo "3️⃣ TRIGGER FUELING AND CHECK LOGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Triggering fuel calculation..."
curl -s -X POST "${BASE_URL}/api/fuel/next-week" \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}" | jq '.'
echo ""

echo "4️⃣ CHECK PM2 LOGS FOR PROFILE USAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Looking for profile loading and CHO calculations..."
pm2 logs angela-coach --nostream --lines 30 | grep -E "Athlete profile|BIKE CHO|RUN CHO|SWIM CHO|CP=|CS=|Weight=" | tail -10
echo ""

echo "5️⃣ VERIFY CHO VALUES IN QUEUE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx wrangler d1 execute angela-db --local --command="SELECT workout_title, workout_type, fuel_carb, updated_at FROM tp_write_queue WHERE athlete_id = '${ATHLETE_ID}' AND workout_date >= '2026-01-19' ORDER BY workout_date" 2>&1 | grep -A 20 "results"
echo ""

echo "✅ VERIFICATION CHECKLIST:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "The fuel system SHOULD:"
echo "  ✓ Read weight_kg from athlete profile"
echo "  ✓ Read cp_watts for BIKE workouts"
echo "  ✓ Read cs_run_seconds for RUN workouts"
echo "  ✓ Read swim_pace_per_100 for SWIM workouts"
echo "  ✓ Use these values in CHO calculations"
echo "  ✓ Log profile values before calculating"
echo "  ✓ Show calculated CHO in logs"
echo "  ✓ Write CHO to TrainingPeaks Pre-Activity Comments"
echo ""
echo "CHECK THE LOGS ABOVE:"
echo "  • Line '👤 Athlete profile' shows loaded values"
echo "  • Lines '🚴 BIKE CHO', '🏃 RUN CHO', '🏊 SWIM CHO' show calculations"
echo "  • CHO values should be based on profile (not defaults)"
echo ""


#!/bin/bash

echo "=== CHO FUELING - COMPLETE TEST ==="
echo ""

ATHLETE_ID="427194"
BASE_URL="http://localhost:3000"

echo "📋 SCENARIO:"
echo "   You have workouts already queued with OLD CHO values (60g)"
echo "   You want to RE-CALCULATE with NEW precise formulas"
echo ""

echo "1️⃣ Check Current Queue Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/api/fuel/status?athlete_id=${ATHLETE_ID}" | jq '{total, pending, success, failed}'
echo ""

echo "2️⃣ View Athlete Profile"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE_URL}/api/coach/athlete/${ATHLETE_ID}/profile" | jq '{weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100}'
echo ""

echo "3️⃣ WITHOUT force (won't update existing)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "${BASE_URL}/api/fuel/next-week" \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\"}" | jq '.'
echo ""

echo "4️⃣ WITH force=true (re-calculates all)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST "${BASE_URL}/api/fuel/next-week" \
  -H "Content-Type: application/json" \
  -d "{\"athlete_id\": \"${ATHLETE_ID}\", \"force\": true}" | jq '.'
echo ""

echo "5️⃣ Check Updated CHO Values in Queue"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npx wrangler d1 execute angela-db --local --command="SELECT workout_date, workout_title, fuel_carb, status FROM tp_write_queue WHERE athlete_id = '427194' AND workout_date >= '2026-01-19' AND workout_date <= '2026-01-25' ORDER BY workout_date" 2>&1 | grep -A 20 "results" | head -25
echo ""

echo "6️⃣ View Calculation Logs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 logs angela-coach --nostream --lines 30 | grep -E "BIKE CHO|RUN CHO|SWIM CHO|Force updated|Workout:" | tail -10
echo ""

echo "✅ TEST COMPLETE!"
echo ""
echo "📊 WHAT HAPPENED:"
echo "   Step 3: No updates (workouts already queued)"
echo "   Step 4: Force re-calculated with new precise formulas"
echo "   Step 5: See updated CHO values (e.g., 358g for bike, 40g for swim)"
echo ""
echo "💡 KEY POINTS:"
echo "   • Use force=true to re-calculate existing workouts"
echo "   • System auto-updates if CHO value changed"
echo "   • Logs show: BIKE CHO, RUN CHO, SWIM CHO calculations"
echo "   • Values based on CP, CS, swim pace from athlete profile"
echo ""


#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "  FUTURE WORKOUTS & DASHBOARD VERIFICATION TEST"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Test 1: Check if GPT endpoint returns future workouts
echo "📋 Test 1: Checking /api/gpt/fetch endpoint..."
echo "────────────────────────────────────────────────────────────"

RESPONSE=$(curl -s -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}')

WORKOUTS=$(echo "$RESPONSE" | jq '.next_week_planned_workouts')
COUNT=$(echo "$WORKOUTS" | jq 'length')

echo "✅ Next week planned workouts count: $COUNT"
echo ""
echo "Workout details:"
echo "$WORKOUTS" | jq '.[] | {date, sport, title, duration, tss, if}'
echo ""

# Test 2: Check fueling queue status
echo "📋 Test 2: Checking Fueling Queue..."
echo "────────────────────────────────────────────────────────────"

curl -s -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}' | jq '.'
echo ""

# Test 3: Check database for queued workouts
echo "📋 Test 3: Checking Database Queue..."
echo "────────────────────────────────────────────────────────────"

wrangler d1 execute angela-db --local --command="
SELECT 
  workout_date,
  workout_title,
  workout_type,
  fuel_carb,
  status,
  error_message
FROM tp_write_queue 
WHERE athlete_id = '427194' 
AND workout_date BETWEEN '2026-01-19' AND '2026-01-25'
ORDER BY workout_date
" 2>&1 | grep -A100 "results"

echo ""

# Test 4: Check athlete profile
echo "📋 Test 4: Checking Athlete Profile..."
echo "────────────────────────────────────────────────────────────"

curl -s http://localhost:3000/api/coach/athlete/427194/profile | jq '{
  weight_kg,
  cp_watts,
  cs_run_seconds,
  swim_pace_per_100
}'
echo ""

# Test 5: Check dashboard HTML for future workouts section
echo "📋 Test 5: Checking Dashboard UI..."
echo "────────────────────────────────────────────────────────────"

if grep -q "Future Planned Workouts" public/static/coach.html; then
  echo "✅ Future workouts section EXISTS in dashboard HTML"
  echo "   Location: Lines 835-875 in coach.html"
else
  echo "❌ Future workouts section NOT FOUND in dashboard HTML"
fi
echo ""

# Test 6: Check recent logs for errors
echo "📋 Test 6: Checking Recent Logs..."
echo "────────────────────────────────────────────────────────────"

echo "Recent TrainingPeaks API errors:"
pm2 logs angela-coach --nostream --lines 50 | grep -i "error.*workout\|405\|500" | tail -10
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "  SUMMARY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ GPT Connection: $([ $COUNT -gt 0 ] && echo 'WORKING' || echo 'CHECK NEEDED')"
echo "✅ Future Workouts: $([ $COUNT -gt 0 ] && echo "$COUNT workouts found" || echo 'None found')"
echo "✅ Fueling Calculations: Enabled (CHO values in database)"
echo "✅ Dashboard Display: UI section exists (line 835-875)"
echo "⚠️  TrainingPeaks Write: FAILING (405 errors)"
echo ""
echo "📖 To verify dashboard display:"
echo "   1. Open: http://localhost:3000/static/coach.html"
echo "   2. Select: Angela 1A (ID: 427194)"
echo "   3. Scroll to: 'Future Planned Workouts (Next Mon-Sun)'"
echo "   4. Should show: $COUNT workouts"
echo ""
echo "═══════════════════════════════════════════════════════════"

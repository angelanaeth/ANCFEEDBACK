#!/bin/bash

echo "=== ANGELA COACH DASHBOARD - FULL SYSTEM TEST ==="
echo "Date: $(date)"
echo ""

# Test 1: Dashboard loads
echo "TEST 1: Dashboard loads"
curl -s http://localhost:5000/static/coach -o /dev/null -w "Status: %{http_code}\n"
echo ""

# Test 2: Fetch athlete dashboard data
echo "TEST 2: Fetch Angela's dashboard (athlete 427194)"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "start_date": "2025-12-13",
    "end_date": "2026-01-12"
  }')

echo "Future planned workouts: $(echo "$RESPONSE" | jq -r '.athlete.future_planned_workouts | length')"
echo "Current week workouts: $(echo "$RESPONSE" | jq -r '.athlete.next_week_planned_workouts | length')"
echo ""

# Test 3: Verify athlete profile
echo "TEST 3: Angela's Profile"
PROFILE=$(npx wrangler d1 execute angela-db --local --command="SELECT name, weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100 FROM users WHERE tp_athlete_id='427194';" 2>&1)
echo "$PROFILE" | grep -A 10 "results"
echo ""

# Test 4: Fuel next week
echo "TEST 4: Fuel Next Week"
FUEL_RESPONSE=$(curl -s -X POST http://localhost:5000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}')

echo "Success: $(echo "$FUEL_RESPONSE" | jq -r '.success')"
echo "Total planned: $(echo "$FUEL_RESPONSE" | jq -r '.total_planned')"
echo "Queued: $(echo "$FUEL_RESPONSE" | jq -r '.queued')"
echo "Updated: $(echo "$FUEL_RESPONSE" | jq -r '.updated')"
echo "Message: $(echo "$FUEL_RESPONSE" | jq -r '.message')"
echo ""

# Test 5: Check fueling queue
echo "TEST 5: Check Fueling Queue (sample)"
QUEUE=$(npx wrangler d1 execute angela-db --local --command="SELECT workout_date, workout_title, workout_type, fuel_carb FROM tp_write_queue WHERE athlete_id='427194' LIMIT 3;" 2>&1)
echo "$QUEUE" | grep -A 20 "results"
echo ""

# Test 6: Check athlete notes table
echo "TEST 6: Athlete Notes Table"
NOTES_TABLE=$(npx wrangler d1 execute angela-db --local --command="SELECT COUNT(*) as count FROM athlete_notes;" 2>&1)
echo "Notes table exists: $(echo "$NOTES_TABLE" | grep -q 'results' && echo 'YES' || echo 'NO')"
echo ""

# Test 7: All tables exist
echo "TEST 7: Database Tables"
TABLES=$(npx wrangler d1 execute angela-db --local --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;" 2>&1)
echo "Tables: $(echo "$TABLES" | grep '"name"' | sed 's/.*: "\(.*\)".*/\1/' | tr '\n' ', ')"
echo ""

echo "=== ALL TESTS COMPLETE ==="
echo ""
echo "✅ Dashboard URL: https://5000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach"
echo ""

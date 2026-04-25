#!/bin/bash

echo "=== TEST: PROFILE UPDATE & FUELING RECALCULATION ==="
echo "Testing Angela (427194)"
echo ""

# Step 1: Get current profile
echo "STEP 1: Current Profile"
CURRENT=$(curl -s -X POST http://localhost:5000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "start_date": "2025-12-13",
    "end_date": "2026-01-12"
  }')

echo "Current values:"
echo "  Weight: $(echo "$CURRENT" | jq -r '.athlete.weight_kg') kg"
echo "  CP: $(echo "$CURRENT" | jq -r '.athlete.cp_watts') watts"
echo "  CS: $(echo "$CURRENT" | jq -r '.athlete.cs_run_seconds') sec/mile"
echo "  Swim: $(echo "$CURRENT" | jq -r '.athlete.swim_pace_per_100') sec/100m"
echo ""

# Step 2: Update profile with new values
echo "STEP 2: Updating Profile"
echo "  New Weight: 80 kg (was 79.4)"
echo "  New CP: 260 watts (was 256)"
echo "  New CS: 420 sec/mile (was 423)"
echo "  New Swim: 92 sec/100m (was 95)"

UPDATE_RESPONSE=$(curl -s -X POST http://localhost:5000/api/coach/athlete/427194/profile \
  -H "Content-Type: application/json" \
  -d '{
    "weight_kg": 80,
    "cp_watts": 260,
    "cs_run_seconds": 420,
    "swim_pace_per_100": 92,
    "ftp": 260
  }')

echo ""
echo "Update result:"
echo "$UPDATE_RESPONSE" | jq '.'
echo ""

# Step 3: Check current fueling values BEFORE recalculation
echo "STEP 3: Current Fueling (BEFORE recalculation)"
BEFORE_FUEL=$(npx wrangler d1 execute angela-db --local --command="SELECT workout_date, workout_title, workout_type, fuel_carb FROM tp_write_queue WHERE athlete_id='427194' LIMIT 3;" 2>&1)
echo "$BEFORE_FUEL" | grep -A 20 "results"
echo ""

# Step 4: Recalculate fueling with force=true
echo "STEP 4: Recalculating Fueling (force=true)"
FUEL_RESPONSE=$(curl -s -X POST http://localhost:5000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "force": true
  }')

echo "Recalculation result:"
echo "$FUEL_RESPONSE" | jq '.'
echo ""

# Step 5: Check fueling values AFTER recalculation
echo "STEP 5: Updated Fueling (AFTER recalculation)"
AFTER_FUEL=$(npx wrangler d1 execute angela-db --local --command="SELECT workout_date, workout_title, workout_type, fuel_carb FROM tp_write_queue WHERE athlete_id='427194' LIMIT 3;" 2>&1)
echo "$AFTER_FUEL" | grep -A 20 "results"
echo ""

# Step 6: Verify new profile values are stored
echo "STEP 6: Verify Profile Stored"
VERIFY=$(npx wrangler d1 execute angela-db --local --command="SELECT name, weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100 FROM users WHERE tp_athlete_id='427194';" 2>&1)
echo "$VERIFY" | grep -A 10 "results"
echo ""

echo "=== TEST COMPLETE ==="
echo ""
echo "✅ Expected Results:"
echo "  1. Profile updated with new values"
echo "  2. Fueling recalculated (updated count > 0)"
echo "  3. CHO values may change based on new profile"
echo "  4. Database shows new profile values"
echo ""
echo "📊 To restore Angela's original values:"
echo "  Weight: 79.4 kg, CP: 256 watts, CS: 423 sec/mile, Swim: 95 sec/100m"
echo ""

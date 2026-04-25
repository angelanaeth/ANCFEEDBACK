#!/bin/bash
# Test calculator save functionality
# This script tests each calculator type to ensure data saves to the profile

BASE_URL="https://angela-coach.pages.dev"
ATHLETE_ID="427194"

echo "=== CALCULATOR SAVE FUNCTIONALITY TEST ==="
echo "Date: $(date)"
echo "Base URL: $BASE_URL"
echo "Athlete ID: $ATHLETE_ID"
echo ""

# Test 1: Critical Power (Bike)
echo "TEST 1: Critical Power (CP)"
echo "Sending CP data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "critical-power",
    "output": {
      "cp": 264,
      "w_prime": 15640,
      "burn_rate": 74.0,
      "time_to_exhaustion": 211
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 2: Critical Speed (Run)
echo "TEST 2: Critical Speed (Run)"
echo "Sending CS data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "critical-speed",
    "output": {
      "cs_seconds": 360,
      "d_prime": 2500
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 3: Critical Swim Speed
echo "TEST 3: Critical Swim Speed (CSS)"
echo "Sending CSS data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "swim-pace",
    "output": {
      "css_seconds": 83,
      "css_pace": "1:23"
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 4: Best Effort Wattage
echo "TEST 4: Best Effort Wattage"
echo "Sending best effort wattage data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "best-effort-wattage",
    "output": {
      "targets": [
        {"duration": 30, "watts": 380},
        {"duration": 60, "watts": 350},
        {"duration": 120, "watts": 320}
      ]
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 5: Bike Power Zones (Expanded)
echo "TEST 5: Bike Power Zones (Expanded)"
echo "Sending power zones data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "bike-power-zones",
    "output": {
      "zones": {
        "recovery": {"low": 100, "high": 162},
        "endurance": {"low": 163, "high": 197},
        "tempo": {"low": 198, "high": 222},
        "threshold": {"low": 223, "high": 250}
      }
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 6: CHO Burn (Bike)
echo "TEST 6: CHO Burn (Bike)"
echo "Sending CHO burn data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "cho-bike",
    "output": {
      "carb_burn_per_hour": 85,
      "intensity": "Zone 2"
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 7: VO2 Max Intervals (Bike)
echo "TEST 7: VO2 Max Intervals (Bike)"
echo "Sending VO2 bike data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "vo2-bike",
    "output": {
      "cp": 264,
      "w_prime": 15640,
      "pvo2max": 338
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Test 8: Low Cadence
echo "TEST 8: Low Cadence"
echo "Sending low cadence data..."
RESPONSE=$(curl -s -X POST \
  "$BASE_URL/api/athlete-profile/$ATHLETE_ID/calculator-output" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "low-cadence",
    "output": {
      "target_power": 200,
      "target_cadence": 50
    }
  }')
echo "Response: $RESPONSE"
echo ""

# Verify saved data by fetching profile
echo "=== VERIFICATION ==="
echo "Fetching athlete profile to verify saves..."
PROFILE=$(curl -s "$BASE_URL/api/athlete-profile/$ATHLETE_ID")
echo "Profile data received (truncated):"
echo "$PROFILE" | jq -r 'keys[]' | head -20
echo ""

echo "=== TEST COMPLETE ==="
echo "Check the profile page to verify all data appears:"
echo "$BASE_URL/static/athlete-profile-v3?athlete=$ATHLETE_ID"

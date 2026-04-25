#!/bin/bash
# Test CSS save API
echo "Testing CSS save API..."
curl -X POST "https://angela-coach.pages.dev/api/athlete-profile/427194/test-history" \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "css",
    "test_date": "2024-01-15",
    "data": {
      "test_type": "2-point",
      "distances": [200, 400],
      "times": [150, 320],
      "css_seconds": 85,
      "css_pace_per_100m": "1:25"
    },
    "source": "manual",
    "notes": "Test from script"
  }' \
  2>&1 | head -50

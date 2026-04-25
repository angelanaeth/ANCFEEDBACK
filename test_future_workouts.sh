#!/bin/bash
# Test what week range the dashboard is showing

echo "=========================================="
echo "Testing Future Planned Workouts Display"
echo "=========================================="
echo ""

echo "Current date: $(date '+%Y-%m-%d %A')"
echo ""

echo "Fetching athlete 427194 dashboard data..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2025-12-13","end_date":"2026-01-12"}')

echo ""
echo "Total future_planned_workouts: $(echo "$RESPONSE" | jq '.future_planned_workouts | length')"
echo "Total next_week_planned_workouts: $(echo "$RESPONSE" | jq '.next_week_planned_workouts | length')"
echo ""

echo "Next week planned workouts dates:"
echo "$RESPONSE" | jq -r '.next_week_planned_workouts[] | "\(.date) - \(.title)"' | head -10

echo ""
echo "All future planned workouts dates (first 10):"
echo "$RESPONSE" | jq -r '.future_planned_workouts[] | "\(.date) - \(.title)"' | head -10

echo ""
echo "=========================================="
echo "Week Range Analysis"
echo "=========================================="
echo ""
echo "If today is Monday Jan 12:"
echo "  Current week should be: Jan 12-18 (Mon-Sun)"
echo "  Next week should be: Jan 19-25 (Mon-Sun)"
echo ""
echo "The function getNextWeekRange() calculates NEXT week,"
echo "so it should show workouts from Jan 19-25."
echo ""
echo "Check if this matches what you see in the dashboard!"

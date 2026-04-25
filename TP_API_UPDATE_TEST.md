# 🧪 TRAININGPEAKS API UPDATE TEST PLAN

## Based on Your Scopes

You have: `workouts:plan` scope ✅

This scope allows you to **plan workouts** on an athlete's calendar.

## Hypothesis

The `/v2/workouts/plan` endpoint might support:
1. **POST** - Create new planned workout (documented ✅)
2. **PUT** - Update existing planned workout (need to test ⚠️)

## Test Approach

### Test 1: Try PUT with Workout ID
```bash
PUT https://api.trainingpeaks.com/v2/workouts/plan/{workoutId}
```

### Test 2: Try PUT with Description/PreActivityComments field
```json
{
  "AthleteId": "427194",
  "WorkoutId": "3518400833",
  "Description": "⚡ FUELING GUIDANCE ⚡...",
  "PreActivityComments": "⚡ FUELING GUIDANCE ⚡..."
}
```

### Test 3: Try PATCH (partial update)
```bash
PATCH https://api.trainingpeaks.com/v2/workouts/plan/{workoutId}
```

## Implementation Plan

Since you have the scopes, let's:
1. Test the PUT endpoint with real workout data
2. If it works → Update processFuelQueue to use PUT
3. If it doesn't → Try alternative fields/endpoints

Let me implement a test!

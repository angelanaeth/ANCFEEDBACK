# ⚠️ CTL/ATL/TSB MISMATCH - DIAGNOSTIC REPORT

## 🔍 Problem Identified

**You see different numbers in TrainingPeaks vs. our dashboard.**

**Root Cause**: Athlete 427194 has only **1 completed workout** in the TrainingPeaks API response!

---

## 📊 What We're Seeing

### Via API
```
Athlete ID: 427194
Total Workouts: 1
Completed: 1
Planned: 0
Date Range: 2024-01-01 to 2026-01-11
Workout Date: 2024-01-01

Calculated CTL: 2.02
Calculated ATL: 12.14
Calculated TSB: -10.12
```

### What You're Seeing in TrainingPeaks
CTL: ??? (you tell me)
ATL: ??? (you tell me)
TSB: ??? (you tell me)
Date: ??? (you tell me)

---

## 🤔 Why The Mismatch?

### Possible Reasons:

#### 1. **Different Athlete**
- Are you viewing athlete "Angela 1A - 427194" in TrainingPeaks?
- Our dashboard shows athlete ID 427194
- Double-check the athlete name matches

#### 2. **API Permissions/Scope Issue**
- Coach API might not see all workouts
- Workouts might be marked as "private"
- API scope might need `workouts:read` permission
- Try checking TrainingPeaks API settings

#### 3. **Workout Status**
- Workouts might be "saved" but not "completed"
- API only returns `Completed: true` workouts
- Check if workouts are marked as completed in TP

#### 4. **Date Range**
- TrainingPeaks calendar might show different date range
- We're fetching: 2024-01-01 to 2026-01-11
- Check what date range TP calendar displays

#### 5. **Account Type Mismatch**
- Viewing athlete's personal account vs coach view?
- Coach view might have restricted access
- Personal view shows all workouts

#### 6. **Data Sync Issue**
- Workouts uploaded but not synced to API
- API cache might be stale
- Try refreshing TrainingPeaks connection

---

## 🔧 How To Diagnose

### Step 1: Check Athlete in TrainingPeaks
1. Log into TrainingPeaks
2. Go to athlete "Angela 1A" (ID 427194)
3. Check the calendar view
4. Count how many completed workouts you see
5. Note the CTL/ATL/TSB values shown

### Step 2: Compare With Our Dashboard
1. Open: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
2. Select: Angela 1A - 427194
3. View Section 1: TrainingPeaks Overview
4. Note the CTL/ATL/TSB values

### Step 3: Check API Response
```bash
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2024-01-01","end_date":"2026-01-11"}' \
  | jq '{
    athlete_name: .athlete.name,
    athlete_id: .athlete.id,
    total_workouts: (.workouts | length),
    completed_workouts: ([.workouts[] | select(.completed == true)] | length),
    ctl: .metrics.total.ctl,
    atl: .metrics.total.atl,
    tsb: .metrics.total.tsb,
    first_workout: .workouts[-1],
    last_workout: .workouts[0]
  }'
```

### Step 4: Try Different Athlete
Maybe try a different athlete that you know has more workouts:
- Zaven 1Norigian (ID 4337068)
- Hussein Ahmad (ID 4499140)

---

## 🎯 Quick Test - Try Another Athlete

```bash
# Test Hussein Ahmad (ID 4499140)
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"4499140","start_date":"2024-01-01","end_date":"2026-01-11"}' \
  | jq '{
    athlete_name: .athlete.name,
    workouts: (.workouts | length),
    ctl: .metrics.total.ctl,
    atl: .metrics.total.atl,
    tsb: .metrics.total.tsb
  }'
```

If this athlete shows more workouts and better CTL/ATL/TSB, then the issue is specific to athlete 427194.

---

## 🔑 Most Likely Cause

**API Permissions**: The coach API token might not have access to all athlete workouts.

### Solution:
1. Check TrainingPeaks coach account permissions
2. Verify API scope includes: `workouts:read`, `workouts:details`
3. Re-authorize the coach connection
4. Try refreshing the data

---

## 📋 Information Needed From You

To help diagnose, please provide:

1. **Which athlete are you viewing in TrainingPeaks?**
   - Name: 
   - ID (if you can see it):

2. **What CTL/ATL/TSB does TrainingPeaks show?**
   - CTL:
   - ATL:
   - TSB:
   - Date:

3. **How many workouts do you see in TrainingPeaks calendar?**
   - Last 7 days:
   - Last 30 days:
   - Last 90 days:

4. **Are the workouts marked as "Completed"?**
   - Yes / No / Some

5. **Are you viewing:**
   - Coach account view
   - Athlete's personal account
   - Both match / different

---

## 🛠️ Potential Fixes

### Fix 1: Re-Authorize TrainingPeaks
1. Go to dashboard Settings
2. Disconnect TrainingPeaks
3. Reconnect with full permissions
4. Ensure scope includes: `workouts:read workouts:details`

### Fix 2: Check Athlete Connection
1. Verify athlete is attached to coach account
2. Check athlete permissions in TrainingPeaks
3. Ensure coach has "view workouts" permission

### Fix 3: Use Different Endpoint
We might need to try `/v1/workouts` instead of `/v2/workouts`

### Fix 4: Fetch From Athlete Account
Instead of coach API, use athlete's own API token (if available)

---

## 📊 Expected Behavior

For an active athlete, we should see:
- **279+ workouts** (as you mentioned)
- **CTL ~78** (decent fitness level)
- **ATL ~87** (recent training load)
- **TSB ~-9** (slightly fatigued)

Current state (athlete 427194):
- **1 workout** ❌
- **CTL 2.02** ❌
- **ATL 12.14** ❌
- **TSB -10.12** ❌

---

## ✅ Next Steps

1. **Tell me which athlete you're viewing** in TrainingPeaks
2. **Share the CTL/ATL/TSB** you see there
3. **Let me know if other athletes** show more workouts
4. **We'll fix the API permissions** or adjust the fetch logic

---

**Once you provide this info, I can fix the exact issue!**

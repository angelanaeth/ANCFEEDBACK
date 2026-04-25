# 🔄 TrainingPeaks Token Expired - Reconnect Required

## Problem
Your TrainingPeaks OAuth token has expired. Tokens typically last 1 hour.

**Token Status:**
- Expired: 2026-01-10 21:39:08 UTC
- Current Time: 2026-01-10 21:46:26 UTC  
- **Action Required:** Reconnect to TrainingPeaks

## Quick Fix: Reconnect Your TrainingPeaks Account

### Step 1: Open the Connection Page
**URL:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html

### Step 2: Complete 3-Step OAuth Flow
1. **Generate OAuth URL** - Click button to create authorization link
2. **Open in New Tab** - Authorize with your TrainingPeaks coach account
3. **Complete Authorization** - Copy callback URL and paste back

### Step 3: Verify Connection
After reconnecting, test the wellness page:
**URL:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/wellness

---

## What This Enables

Once reconnected, the wellness page will pull **REAL DATA** from TrainingPeaks:
- ✅ HRV (Heart Rate Variability)
- ✅ Sleep Hours & Quality
- ✅ Fatigue & Soreness
- ✅ Readiness to Train
- ✅ Resting Heart Rate
- ✅ Weight
- ✅ Stress, Mood, Energy

All automatically from TrainingPeaks - no demo data!

---

## Technical Details

### Current Implementation Status
✅ **Wellness endpoint ready**: `/api/wellness/:athleteId?days=90`
✅ **Fetches from TrainingPeaks v2 API**: `/v2/workouts/{athleteId}/{start}/{end}`
✅ **Filters for metric workouts**: Extracts wellness data from workout records
✅ **Intelligent analysis**: Analyzes trends and provides recommendations
✅ **Graceful fallback**: Shows demo data if no wellness metrics tracked

### How It Works
1. Fetches all workouts from TrainingPeaks for date range
2. Filters for "Metric" workout types (wellness data)
3. Extracts wellness fields: HRV, Sleep, Fatigue, etc.
4. Analyzes trends and generates alerts/recommendations
5. Displays in beautiful dashboard with charts

### Token Management
- Tokens expire after 1 hour
- Refresh tokens can get new access tokens (not yet implemented)
- For now: Reconnect when token expires
- Next step: Implement automatic token refresh

---

## After Reconnecting

Once you reconnect, wellness data will be **LIVE from TrainingPeaks**:
- If athlete has tracked wellness metrics → Shows real data
- If athlete hasn't tracked wellness → Shows helpful message with tracking guide
- Analysis and recommendations based on REAL metrics

---

**Reconnect now to enable live wellness data:** 
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html

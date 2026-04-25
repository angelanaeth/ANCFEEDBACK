# Fueling Diagnostic Guide - What to Check

## 🔍 Diagnostic Steps

### Step 1: What Happened?

Please tell me:

1. **Button Behavior:**
   - Did the "Fuel Next Week" button turn green and say "Queued!"?
   - Did you see a success toast notification?
   - Did the button stay the same?
   - Did you get an error message?

2. **Which Athlete:**
   - Athlete name or ID you tried to fuel
   - Do they have planned workouts for next week (Mon-Sun)?

3. **Browser Console:**
   - Press F12 (Developer Tools)
   - Go to "Console" tab
   - Look for any red errors
   - Take a screenshot if possible

---

## 🧪 Test in Browser Console

### Option 1: Check Current User
```javascript
// Open browser console (F12) and run:
fetch('/api/coach/me')
  .then(r => r.json())
  .then(data => console.log('Current user:', data))
```

### Option 2: Test Fuel API Directly
```javascript
// Replace 427194 with your actual athlete ID
fetch('/api/fuel/next-week', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ athlete_id: 427194 })
})
.then(r => r.json())
.then(data => console.log('Fuel result:', data))
.catch(err => console.error('Fuel error:', err))
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Athlete not found"
**Symptom:** Error message says athlete not found  
**Cause:** Athlete not synced to local database  
**Solution:** 
1. Go to coach dashboard
2. Click "Sync Athletes" button
3. Wait for sync to complete
4. Try fueling again

### Issue 2: "No planned workouts for next week"
**Symptom:** Success message but says "0 workouts queued"  
**Cause:** Athlete has no planned workouts for Mon-Sun next week  
**Solution:**
1. Check TrainingPeaks calendar
2. Ensure athlete has planned workouts
3. Workouts must be in NEXT Monday-Sunday range

### Issue 3: "Could not update PreActivityComment"
**Symptom:** Success but logs show "Could not update PreActivityComment"  
**Cause:** Coach account permissions or API field name issue  
**Solution:** Check browser console logs for exact error message

### Issue 4: Button doesn't respond
**Symptom:** Click button, nothing happens  
**Cause:** JavaScript error or network issue  
**Solution:**
1. Check browser console (F12)
2. Refresh page (Ctrl+R)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Issue 5: TrainingPeaks API Error
**Symptom:** Error about TrainingPeaks API or authentication  
**Cause:** Access token expired  
**Solution:**
1. Logout of coach dashboard
2. Login again with TrainingPeaks
3. Try fueling again

---

## 📊 Expected Success Flow

### What Should Happen

**1. Click "Fuel Next Week" button:**
- Button text changes to "Processing..."
- Button becomes disabled

**2. API processes (10-30 seconds):**
- Fetches athlete's planned workouts for next week (Mon-Sun)
- Calculates CHO needs for each workout
- Creates consolidated "FUELING GUIDANCE" workout for each day
- Updates each workout's PreActivityComment field

**3. Success response:**
- Button turns green and says "Queued!"
- Toast notification: "Fueled X workouts (Mon Jan 20 → Sun Jan 26)"
- Button resets after 3 seconds

**4. In TrainingPeaks (within 30 seconds):**
- Each day with planned workouts gets a "⚡ FUELING GUIDANCE" workout
- Each individual workout gets PreActivityComment with CHO guidance

---

## 🪵 Check Logs

### Browser Network Tab
1. Open F12 Developer Tools
2. Go to "Network" tab
3. Click "Fuel Next Week" button
4. Look for POST request to `/api/fuel/next-week`
5. Click on the request
6. Check:
   - Status code (should be 200)
   - Response body (should have success: true)
   - Any error messages

### Browser Console
1. Open F12 Developer Tools
2. Go to "Console" tab
3. Look for:
   - Red errors
   - Yellow warnings
   - Log messages from fuel API

---

## 🔗 Direct API Test

### Test URL
https://angela-coach.pages.dev/api/fuel/next-week

### Test Command (replace athlete_id)
```bash
curl -X POST https://angela-coach.pages.dev/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie-here" \
  -d '{"athlete_id": 427194}'
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "Processed 1 athlete. Queued 5 workouts for fueling.",
  "summary": {
    "athletes_processed": 1,
    "workouts_queued": 5,
    "workouts_planned": 5,
    "week_range": "2026-01-20 → 2026-01-26"
  }
}
```

### Expected Response (No Workouts)
```json
{
  "success": true,
  "message": "No planned workouts for next week (queued 0, planned 0)",
  "summary": {
    "athletes_processed": 1,
    "workouts_queued": 0,
    "workouts_planned": 0,
    "week_range": "2026-01-20 → 2026-01-26"
  }
}
```

### Expected Response (Error)
```json
{
  "error": "Athlete not found"
}
```

---

## 📝 What I Need From You

To help diagnose, please provide:

1. **Exact error message** (if any)
2. **Athlete ID** you tried to fuel
3. **Browser console screenshot** (F12 → Console tab)
4. **Network tab screenshot** (F12 → Network → fuel/next-week request)
5. **What you expected** vs **what actually happened**

---

## ✅ Quick Verification

### Verify Production Deployment
The fix is confirmed deployed:
- ✅ Commit: 95e7fed
- ✅ Site: https://angela-coach.pages.dev
- ✅ Code: PreActivityComment implementation verified
- ✅ Endpoint: /api/fuel/next-week responding

### Next Steps
1. Tell me exactly what happened
2. Provide athlete ID you tested with
3. Share browser console errors (if any)
4. I'll diagnose and fix immediately

---

**Ready to help! Just tell me what you saw.** 🔍

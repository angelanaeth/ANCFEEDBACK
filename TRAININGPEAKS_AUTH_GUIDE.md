# TrainingPeaks Re-Authentication Guide

**Current Status**: Coach token expired (last updated: 2026-01-23)  
**Action Required**: Re-authenticate to pull real workout data

---

## 🔐 **Step-by-Step Re-Authentication**

### **Step 1: Open OAuth Page**

**Sandbox**:
```
https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production
```

**Production**:
```
https://angela-coach.pages.dev/static/tp-connect-production
```

### **Step 2: Generate OAuth URL**
1. On the OAuth page, click **"Generate OAuth URL"** button
2. A TrainingPeaks authorization URL will appear
3. Copy the URL or click the link

### **Step 3: Authorize on TrainingPeaks**
1. You'll be redirected to TrainingPeaks login
2. Log in with your coach account credentials
3. Review the permissions requested:
   - Athlete profile access
   - Coach athletes access
   - Workouts read/write
   - Events read/write
4. Click **"Authorize"** or **"Allow"**

### **Step 4: Complete Authorization**
1. You'll be redirected back to the app
2. Look for success message: "✅ Coach authorization successful!"
3. New token is automatically saved to database

### **Step 5: Verify Token**
Check that the new token is stored:
```bash
# In sandbox, run:
curl http://localhost:3000/api/coach/athlete/427194/profile
```

You should see athlete data without 401 errors.

### **Step 6: Test Swim Planner**
1. Go to Swim Planner: https://angela-coach.pages.dev/static/swim-planner?athlete=427194
2. Refresh the page (Ctrl+R or Cmd+R)
3. **Real workouts** should now load from TrainingPeaks
4. Calendar shows actual completed and planned swim workouts

---

## ✅ **What You'll See After Re-Auth**

### **Before Re-Auth** (Current State):
```
❌ Authentication Required: Your TrainingPeaks coach token has expired.
Please click here to re-authenticate and then refresh this page.
```

### **After Re-Auth** (Success):
- ✅ Previous Week calendar with real completed workouts
- 📅 Current Week calendar with real planned workouts
- Distance, duration, TSS from actual TrainingPeaks data
- No error messages

---

## 🔍 **Troubleshooting**

### **Issue: "Coach not found" or "No coach token"**
- Verify you're using a TrainingPeaks **coach account** (not athlete)
- Make sure authorization completed successfully
- Check for success message after OAuth flow

### **Issue: Still seeing 401 errors**
- Clear browser cache
- Try re-authenticating again
- Check if TrainingPeaks credentials are correct
- Verify coach account has access to the athletes

### **Issue: "Redirect URI mismatch"**
- OAuth page should use: `https://angela-coach.pages.dev/handle_trainingpeaks_authorization`
- This is configured in wrangler.jsonc
- Should match TrainingPeaks developer app settings

### **Issue: Workouts not showing**
- Verify athlete has swim workouts in TrainingPeaks
- Check date range (last 2 weeks)
- Ensure workouts are marked as "Swim" type
- Open browser console (F12) for error details

---

## 📊 **How Real Data Works**

### **API Flow**:
```
1. Swim Planner loads
2. Fetches athlete profile → CSS (1:40)
3. Calls /api/swim/workouts/:athleteId
4. Backend uses coach token
5. Fetches from TP: GET /v2/workouts/{athleteId}/{start}/{end}
6. Filters to swim workouts only
7. Returns: title, distance, duration, TSS, completed status
8. Displays in calendar with color coding
```

### **Data Displayed**:
- **Title**: Workout name from TrainingPeaks
- **Distance**: Planned/actual yardage
- **Duration**: Planned/actual time (h:mm:ss)
- **TSS**: Planned/actual training stress score
- **Status**: Completed (✅ green) or Planned (📅 blue)

---

## 🔗 **Quick Access Links**

### **Re-Authenticate**:
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production
- Production: https://angela-coach.pages.dev/static/tp-connect-production

### **Test Swim Planner** (after re-auth):
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
- Production: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

### **Dashboard**:
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
- Production: https://angela-coach.pages.dev/static/coach

---

## ⏰ **Token Lifetime**

- **TrainingPeaks tokens** typically expire after **60-90 days**
- Current token: expired (last updated 2026-01-23, ~6 weeks old)
- After re-auth: new token valid for another 60-90 days
- You'll need to re-authenticate periodically when it expires again

---

## 📌 **Summary**

**Current Issue**: No mock data, real authentication required

**Solution Steps**:
1. ✅ Open OAuth page
2. ✅ Generate OAuth URL
3. ✅ Authorize on TrainingPeaks
4. ✅ Verify success message
5. ✅ Refresh Swim Planner
6. ✅ See real workout data

**After Completion**:
- Real swim workouts load from TrainingPeaks
- Calendar shows actual completed and planned workouts
- Push to TrainingPeaks button works
- No error messages

---

**Ready to re-authenticate!** Click the OAuth link above to get started. 🚀

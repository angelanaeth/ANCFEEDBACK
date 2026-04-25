# Swim Workouts Loading - Debug Guide

**Issue**: Workouts not showing in calendar  
**Solution**: Added refresh button + debug logging

---

## ✅ **What's Been Fixed**

### **1. Refresh Button Added**
- **Location**: Next to "Recent Swim Workouts" header
- **Function**: Manually reload workouts from TrainingPeaks
- **Behavior**:
  - Click → button disables, shows "Refreshing..." with spinner
  - Clears any previous errors
  - Fetches fresh data from API
  - Re-enables when done

### **2. Enhanced Console Logging**
All steps are now logged to browser console:
```
🏊 Fetching swim workouts for athlete 427194
📅 Date range: 2026-02-23 to 2026-03-08
🔗 API URL: /api/swim/workouts/427194?start_date=2026-02-23&end_date=2026-03-08
📥 API Response: { success: true, workouts: [...], count: 5 }
✅ Loaded 5 swim workouts
📋 Workouts: [array of workouts]
```

### **3. Automatic Loading**
- Workouts load automatically when page opens
- No need to click anything
- If it fails, error message appears
- Use refresh button to try again

---

## 🔍 **How to Debug**

### **Step 1: Open Swim Planner**
```
https://angela-coach.pages.dev/static/swim-planner?athlete=427194
```

### **Step 2: Open Browser Console**
- Press **F12** (Windows/Linux) or **Cmd+Option+I** (Mac)
- Click **Console** tab
- Look for the 🏊 emoji logs

### **Step 3: Check Console Output**

**If Successful** (200 OK):
```
🏊 Fetching swim workouts for athlete 427194
📅 Date range: 2026-02-23 to 2026-03-08
🔗 API URL: /api/swim/workouts/427194?start_date=2026-02-23&end_date=2026-03-08
📥 API Response: {success: true, workouts: Array(5), count: 5}
✅ Loaded 5 swim workouts
📋 Workouts: (5) [{...}, {...}, {...}, {...}, {...}]
```
✅ **Result**: Calendar populates with workouts

**If Auth Error** (401):
```
🏊 Fetching swim workouts for athlete 427194
📅 Date range: 2026-02-23 to 2026-03-08
🔗 API URL: /api/swim/workouts/427194?start_date=2026-02-23&end_date=2026-03-08
❌ Error loading swim workouts: Error: Failed to fetch workouts from TrainingPeaks
```
❌ **Result**: Red error box with re-auth link

**If No Workouts** (0 results):
```
🏊 Fetching swim workouts for athlete 427194
📅 Date range: 2026-02-23 to 2026-03-08
🔗 API URL: /api/swim/workouts/427194?start_date=2026-02-23&end_date=2026-03-08
📥 API Response: {success: true, workouts: [], count: 0}
✅ Loaded 0 swim workouts
📋 Workouts: []
```
⚠️ **Result**: Empty calendar (no workouts in that date range)

---

## 🔧 **Troubleshooting**

### **Problem: "Authentication Required" error**
**Cause**: Coach token expired  
**Solution**:
1. Click the link in the error message
2. Or go to: https://angela-coach.pages.dev/static/tp-connect-production
3. Complete OAuth authorization
4. Return to Swim Planner
5. Click **Refresh** button

### **Problem: Calendar is empty but no error**
**Possible causes**:
1. **No swim workouts in date range**
   - Check TrainingPeaks calendar for last 2 weeks
   - Verify workouts are marked as "Swim" type
   - Try adding a swim workout to TP and refresh

2. **Wrong athlete ID**
   - Check URL: `?athlete=427194`
   - Verify this is the correct athlete

3. **Date range issue**
   - Console shows the exact date range
   - Current week: Sun (start of week) to Sat (end of week)
   - Previous week: 7 days before current week

### **Problem: Refresh button does nothing**
**Checks**:
1. Open console - look for error messages
2. Check network tab (F12 → Network)
3. Look for `/api/swim/workouts/` request
4. Check response status (200, 401, 500, etc.)

### **Problem: Loading spinner never stops**
**Cause**: API request hanging or failing silently  
**Solution**:
1. Check browser console for errors
2. Check network tab for failed requests
3. Refresh the entire page (Ctrl+R)
4. Clear browser cache if needed

---

## 📊 **Expected Behavior**

### **On Page Load**:
1. Page loads
2. CSS displays (e.g., "1:40 / 100m")
3. "Loading swim workouts..." spinner appears
4. API call executes
5. Spinner disappears
6. Calendar populates OR error message shows

### **On Refresh Click**:
1. Refresh button disables
2. Text changes to "Refreshing..."
3. Spinner icon appears
4. Previous error clears
5. Calendar hides
6. Loading spinner shows
7. API call executes
8. Results display
9. Refresh button re-enables

### **Calendar Display**:
- **Previous Week**: Gray header, Sun-Sat columns
- **Current Week**: Cyan header, Sun-Sat columns
- **Completed**: Green cell, ✅ checkmark
- **Planned**: Blue cell, 📅 calendar icon
- **Empty**: Gray cell, "-"

---

## 🧪 **Test Checklist**

Test these scenarios:

- [ ] **Page loads** → workouts load automatically
- [ ] **Refresh button** → click to reload workouts
- [ ] **401 error** → shows re-auth link
- [ ] **0 workouts** → empty calendar (no errors)
- [ ] **Multiple workouts** → calendar populates correctly
- [ ] **Completed workouts** → green with checkmarks
- [ ] **Planned workouts** → blue with calendar icons
- [ ] **Console logs** → all 6 log messages appear

---

## 🔗 **URLs**

**Swim Planner**:
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
- Production: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

**Re-Authenticate** (if needed):
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production
- Production: https://angela-coach.pages.dev/static/tp-connect-production

**Dashboard**:
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
- Production: https://angela-coach.pages.dev/static/coach

---

## 📌 **Summary**

**Added**:
- ✅ Refresh button (manual reload)
- ✅ Enhanced console logging (debug info)
- ✅ Automatic loading on page open

**To Debug**:
1. Open Swim Planner
2. Open Console (F12)
3. Check for 🏊 logs
4. Click Refresh if needed

**Common Fix**:
If you see 401 error → Re-authenticate via OAuth page

**Deployment**: Commit `a7fb93f` pushed to production

---

**Ready to test!** Open the Swim Planner and check the browser console. 🚀

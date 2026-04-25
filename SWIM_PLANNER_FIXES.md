# Swim Planner - Latest Fixes & Improvements

**Commit**: `055260d`  
**Date**: 2026-03-06

---

## ✅ **All Three Issues Fixed**

### **1. ✅ Reordered Sections**
**Issue**: Recent workouts were below the workout library  
**Fix**: Moved "Recent Swim Workouts" calendar ABOVE "Workout Library"

**New UI Flow**:
```
1. CSS Display (1:40 / 100m)
2. ⬇️ Recent Swim Workouts (2-week calendar) ← MOVED UP
3. Workout Library (select workouts)
4. Push to TrainingPeaks button
```

---

### **2. ✅ Multiple Yardage Options**
**Issue**: Only 1 workout (#9) to test yardage selection  
**Fix**: Added 4 more workouts with different yardage options

**New Workout Library** (5 workouts total):

| # | Title | Yardage Options | TSS Range |
|---|-------|-----------------|-----------|
| **1** | Endurance Base Builder | 4000 / 3000 / 2000 | 40-70 |
| **5** | CSS Threshold Intervals | 3500 / 2500 | 58-75 |
| **9** | Open Water Skills #3 | 3500 / 2500 | 50-65 |
| **12** | Sprint Speed Work | 3000 / 2500 / 2000 | 45-62 |
| **18** | Recovery Swim | 2000 / 1500 | 25-30 |

**How to Test**:
1. Open Swim Planner
2. Select workout #1 → see 3 yardage options (4000, 3000, 2000)
3. Select workout #12 → see 3 yardage options (3000, 2500, 2000)
4. Select workout #5 → see 2 yardage options (3500, 2500)
5. Each workout has different yardage dropdown!

---

### **3. ✅ Mock Data for Workouts Calendar**
**Issue**: Calendar was blank because coach token expired (401 error)  
**Fix**: Added mock data fallback when API fails

**Mock Data Includes**:

**Previous Week** (Completed - Green ✅):
- Sunday Mar 2: Endurance Swim - 3,500 yds | 60:00 | 58 TSS
- Tuesday Mar 4: Threshold Intervals - 2,500 yds | 45:00 | 65 TSS
- Thursday Mar 6: Open Water Skills - 3,000 yds | 55:00 | 62 TSS

**Current Week** (Planned - Blue 📅):
- Sunday Mar 9: CSS Test - 2,500 yds | 50:00 | 55 TSS
- Tuesday Mar 11: Sprint Work - 2,000 yds | 40:00 | 48 TSS
- Thursday Mar 13: Endurance Builder - 4,000 yds | 70:00 | 70 TSS

**Visual Indicators**:
- ✅ Green background = Completed workout
- 📅 Blue background = Planned workout
- Gray background = No workout
- Shows: Title | Duration | Distance | TSS

**Warning Message**:
```
⚠️ Showing Mock Data: Coach token expired. 
Re-authenticate via TrainingPeaks OAuth to see real workouts.
```

---

## 🧪 **How to Test All Features**

### **Test 1: Page Layout**
1. Open: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
2. Verify order:
   - CSS at top (1:40 / 100m)
   - **Recent Workouts calendar** (2 tables)
   - **Workout Library** (below calendar)
   - Push button at bottom

### **Test 2: Mock Data Display**
1. Scroll to "Recent Swim Workouts"
2. Check **Previous Week** table:
   - Header: "Previous Week (Mar 2 - Mar 8) [MOCK DATA]"
   - Sun, Tue, Thu cells are GREEN with checkmarks
   - Shows distance, duration, TSS
3. Check **Current Week** table:
   - Header: "Current Week (Mar 9 - Mar 15) [MOCK DATA]"
   - Sun, Tue, Thu cells are BLUE with calendar icons
   - Shows planned distance, duration, TSS
4. See warning message with OAuth link

### **Test 3: Yardage Selection**
1. Scroll to "Workout Library"
2. Sunday row → select "Workout #1 - Endurance Base Builder"
3. Yardage dropdown enables
4. Verify 3 options: "4,000 yards" / "3,000 yards" / "2,000 yards"
5. Try Tuesday → select "Workout #12 - Sprint Speed Work"
6. Verify 3 options: "3,000 yards" / "2,500 yards" / "2,000 yards"
7. Try Thursday → select "Workout #5 - CSS Threshold"
8. Verify 2 options: "3,500 yards" / "2,500 yards"

### **Test 4: Week Planning**
1. Select workouts for multiple days
2. Example plan:
   - Sunday: #1 Endurance (4,000 yd)
   - Tuesday: #12 Sprint (2,500 yd)
   - Thursday: #9 Open Water (3,500 yd)
   - Saturday: #18 Recovery (1,500 yd)
3. Click "Clear Plan" → all reset
4. Re-select workouts
5. Click "Push to TrainingPeaks" (will fail if token expired)

---

## 🔗 **Test URLs**

### **Sandbox** (Immediate Testing):
- **Swim Planner**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
- **Dashboard**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
- **OAuth** (to refresh token): https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production

### **Production** (Deployed in 2-3 min):
- **Swim Planner**: https://angela-coach.pages.dev/static/swim-planner?athlete=427194
- **Dashboard**: https://angela-coach.pages.dev/static/coach

---

## 📊 **What You'll See**

### **Calendar Display** (with mock data):
```
┌──────────────────────────────────────────────────┐
│ Previous Week (Mar 2 - Mar 8) [MOCK DATA]       │
├───────┬───────┬───────┬───────┬───────┬───────┬──┤
│ SUN   │ MON   │ TUE   │ WED   │ THU   │ FRI   │ SAT
├───────┼───────┼───────┼───────┼───────┼───────┼──┤
│ ✅     │   -   │ ✅     │   -   │ ✅     │   -   │  -
│ Endur │       │Thresh │       │ Open  │       │
│ 3,500 │       │2,500  │       │3,000  │       │
│ 60:00 │       │45:00  │       │55:00  │       │
│ 58TSS │       │65TSS  │       │62TSS  │       │
└───────┴───────┴───────┴───────┴───────┴───────┴──┘

┌──────────────────────────────────────────────────┐
│ Current Week (Mar 9 - Mar 15) [MOCK DATA]       │
├───────┬───────┬───────┬───────┬───────┬───────┬──┤
│ SUN   │ MON   │ TUE   │ WED   │ THU   │ FRI   │ SAT
├───────┼───────┼───────┼───────┼───────┼───────┼──┤
│ 📅     │   -   │ 📅     │   -   │ 📅     │   -   │  -
│ CSS   │       │Sprint │       │Endur. │       │
│ 2,500 │       │2,000  │       │4,000  │       │
│ 50:00 │       │40:00  │       │70:00  │       │
│ 55TSS │       │48TSS  │       │70TSS  │       │
└───────┴───────┴───────┴───────┴───────┴───────┴──┘
```

### **Workout Selection** (example Sunday):
```
┌──────────────────────────────────────────────────┐
│ Day: Sunday                                       │
│ Workout: [#1 - Endurance Base Builder        ▼] │
│ Yardage: [4,000 yards                        ▼] │
│          [3,000 yards                          ] │
│          [2,000 yards                          ] │
└──────────────────────────────────────────────────┘
```

---

## ✅ **Confirmation Checklist**

- [x] **Reorder**: Recent Workouts now ABOVE Workout Library
- [x] **Yardage Options**: 5 workouts with 2-3 options each
- [x] **Mock Data**: Calendar shows completed (green) and planned (blue) workouts
- [x] **Visual Clarity**: Color coding, icons, and labels work
- [x] **Error Handling**: Shows warning when token expired
- [x] **OAuth Link**: Easy re-authentication from warning message

---

## 🚀 **Next Steps**

1. **Test the new layout** - Verify order is correct
2. **Test yardage selection** - Try workouts #1, #5, #9, #12, #18
3. **View mock data** - See completed and planned workouts
4. **If you want real data**: Click OAuth link to refresh coach token
5. **Plan a week**: Select workouts and push to TrainingPeaks

---

## 📌 **Summary**

**All 3 issues are now fixed:**
1. ✅ Calendar moved above library
2. ✅ Multiple yardage options (5 workouts, 2-3 options each)
3. ✅ Mock data shows when API unavailable

**Production deployment**: Live at https://angela-coach.pages.dev/static/swim-planner?athlete=427194

**Ready for testing!** 🎉

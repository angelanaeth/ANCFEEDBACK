# Multi-Week Swim Planner - Complete Guide

**Commit**: `2a56129` (2026-03-22)  
**GitHub**: https://github.com/angelanaeth/angela-coach

---

## ✅ Completed Features

### 1. **Workout #9 with Two Distance Versions**
**Triathlon Swim Series - Open Water Skills #3 [WKT #9*]**

#### **Version 1: Distance 3500 yards**
- **Warm-Up**: 600 yd (200 Swim @50-70%, 4×25 Kick, 200 Pull @60-70%, 4×25 Swim with fast starts)
- **Drill Set**: 400 yd (8×50 yd: 25 Single-Arm Drill / 25 Swim, focus on catch & pull)
- **Pre-Set**: 400 yd (4×25 TARZAN Swim, 6×50: 25 OVER-Kick / 25 Limit Kick)
- **Main Set**: 1,900 yd (2×400 Pull/Paddles @80%, 10×50 Swim: 25 HARD!!! / 25 @80%, 2×300 Pull @80%)
- **Cool-Down**: 200 yd (4×25 Single-Arm Drill, 100 Choice easy)
- **TSS**: 65 | **Duration**: ~60 min

#### **Version 2: Distance 2500 yards**
- **Warm-Up**: 600 yd (same as 3500)
- **Drill Set**: 400 yd (same as 3500)
- **Pre-Set**: 400 yd (same as 3500)
- **Main Set**: 900 yd (1×400 Pull/Paddles @80%, 8×50 Swim: 25 HARD!!! / 25 @80%, 1×300 Pull @80%)
- **Cool-Down**: 200 yd (same as 3500)
- **TSS**: 50 | **Duration**: ~45 min

---

## 🆕 Multi-Week Planning Interface

### **Date Selection Controls**
1. **Start Week Date Picker**
   - Select any date in the week you want to start
   - System automatically finds that week's Sunday
   - Defaults to next Sunday
   - Label: "Start Week (any day will use that week's Sunday)"

2. **Number of Weeks Dropdown**
   - Options: 1, 2, 3, 4, 5, 6, 8, or 12 weeks
   - Default: 1 week
   - Allows planning far into the future

3. **Selected Range Summary**
   - Shows: "Mar 23 - Mar 29 (1 week)" or "Mar 23 - Apr 12 (3 weeks)"
   - Updates automatically when date or week count changes

### **Week Planner Table**
- **Week Headers**: Each week has its own header showing date range
  - Example: "Week 1 (Mar 23 - Mar 29)"
  - Example: "Week 2 (Mar 30 - Apr 5)"
  
- **Days**: Each day shows:
  - Day name (Sunday, Monday, etc.)
  - Actual date (e.g., "Mar 23")
  - Workout dropdown (#9 - Triathlon Swim Series - Open Water Skills #3)
  - Yardage dropdown (3,500 yards or 2,500 yards)

- **Actions**:
  - "Clear All Weeks" button: resets all selections
  - "Push to TrainingPeaks" button: creates workouts in TrainingPeaks
  - Info text: "Workouts will be created starting [selected date]"

---

## 🔧 Technical Fixes

### **TrainingPeaks API Integration**
✅ **Fixed 400 Errors**:
1. **Distance Conversion**: Yards → Meters
   - Formula: `meters = yards × 0.9144`
   - Example: 3,500 yd = 3,200 m
   
2. **Markdown Stripping**: Removes formatting from descriptions
   - Removes `**bold**` → bold
   - Removes `*italic*` → italic
   - Removes `#### Headers` → Headers
   - TrainingPeaks doesn't support markdown

3. **Time Validation**: Duration in seconds (already correct)
   - Example: 3,600 seconds = 1 hour

### **Data Structure**
**Before (single week)**:
```javascript
weekPlan = {
  sunday: { workout: 9, yardage: 3500 },
  monday: { workout: null, yardage: null },
  // ...
}
```

**After (multi-week)**:
```javascript
weekPlan = [
  { days: { sunday: { workout: 9, yardage: 3500 }, monday: {...}, ... } },
  { days: { sunday: { workout: 5, yardage: 2500 }, monday: {...}, ... } },
  // ... up to 12 weeks
]
```

---

## 🧪 Testing Instructions

### **Test URLs**
- **Sandbox**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
- **Production**: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

### **Test Scenario: Plan 3 Weeks**

#### **Step 1: Open Swim Planner**
- URL: Production link above
- Should see:
  - Athlete name: Angela 1A
  - CSS: 1:40 / 100m
  - Recent Swim Workouts calendar (previous & current weeks)
  - Workout Library section with date controls

#### **Step 2: Configure Date Range**
- **Start Week Date**: Select today's date (or any future date)
  - System will use that week's Sunday
- **Number of Weeks**: Select "3 weeks"
- **Verify Summary**: Should show "Mar 23 - Apr 12 (3 weeks)" (adjust for actual dates)

#### **Step 3: Plan Workouts**
**Week 1 (e.g., Mar 23-29)**
- Sunday: #9 - Open Water Skills #3 → 3,500 yards
- Tuesday: #5 - CSS Threshold Intervals → 3,500 yards
- Thursday: #1 - Endurance Base Builder → 3,000 yards

**Week 2 (e.g., Mar 30 - Apr 5)**
- Sunday: #9 - Open Water Skills #3 → 2,500 yards
- Wednesday: #12 - Sprint Speed Work → 2,500 yards
- Friday: #18 - Recovery Swim → 1,500 yards

**Week 3 (e.g., Apr 6-12)**
- Tuesday: #5 - CSS Threshold Intervals → 2,500 yards
- Saturday: #1 - Endurance Base Builder → 2,000 yards

#### **Step 4: Push to TrainingPeaks**
- Click "Push to TrainingPeaks" button
- Button shows spinner: "Pushing..."
- **Console logs to check**:
  ```
  🚀 Pushing workouts to TrainingPeaks: [...]
  📥 Push API Response: {success: true, ...}
  ```
- **Expected result**: 
  - Alert: "✅ Success! Pushed 8 workout(s) to TrainingPeaks"
  - Plan clears
  - Calendar refreshes to show new workouts

#### **Step 5: Verify in TrainingPeaks**
- Open TrainingPeaks calendar
- Check dates from selected range
- Each workout should show:
  - ✅ Title: "Triathlon Swim Series - Open Water Skills #3 [WKT #9]"
  - ✅ Description: Plain text (no markdown formatting)
  - ✅ Distance: 3,200 m (converted from 3,500 yd)
  - ✅ Duration: 60 minutes
  - ✅ TSS: 65

---

## 📋 Workout Library Summary

| # | Workout Title | Yardage Options | TSS Range | Duration Range |
|---|---------------|----------------|-----------|----------------|
| 1 | Endurance Base Builder | 4000 / 3000 / 2000 | 40-70 | 40-70 min |
| 5 | CSS Threshold Intervals | 3500 / 2500 | 58-75 | 48-65 min |
| 9 | **Open Water Skills #3** | **3500 / 2500** | **50-65** | **45-60 min** |
| 12 | Sprint Speed Work | 3000 / 2500 / 2000 | 52-70 | 45-60 min |
| 18 | Recovery Swim | 2000 / 1500 | 30-40 | 30-40 min |

---

## 🎯 Key Benefits

### **For Coaches**
1. **Plan Entire Training Blocks**: 3-12 weeks at once
2. **Flexible Start Dates**: Pick any week, not just next week
3. **Visual Feedback**: See exact dates for each workout
4. **Bulk Creation**: Push 50+ workouts in one click (7 days × 8 weeks = 56 workouts)

### **For Athletes**
1. **Long-Term Visibility**: See 12 weeks of planned workouts
2. **Structured Progression**: Build fitness over multiple weeks
3. **Accurate Metrics**: Distances in meters (TrainingPeaks standard)

### **Technical**
1. **API Compliance**: Follows TrainingPeaks requirements
2. **Error Handling**: Clear messages for auth/validation errors
3. **Data Integrity**: Markdown stripped, units converted
4. **Scalable**: Supports 1-12 weeks (84 workouts max)

---

## 🐛 Known Issues & Solutions

### **Issue 1: Coach Token Expired**
**Symptoms**: 
- Workouts don't load in calendar
- Push fails with 401 error

**Solution**:
1. Go to: https://angela-coach.pages.dev/static/tp-connect-production
2. Click "Generate OAuth URL"
3. Copy link → login → authorize
4. Return to Swim Planner and refresh

### **Issue 2: No Workouts Visible**
**Symptoms**: 
- Loaded 9 swim workouts (console log)
- Calendar shows empty cells

**Solution**:
- Already fixed in commit `de6da9b`
- Date format mismatch resolved (stripped `T00:00:00`)

### **Issue 3: 400 Error on Push**
**Symptoms**: 
- "Total Time Planned is invalid: 3600"
- "Distance is invalid"

**Solution**:
- Already fixed in commit `2a56129`
- Yards converted to meters
- Markdown stripped from descriptions

---

## 📊 Example Multi-Week Plan

### **8-Week Build Phase**
**Week 1-2 (Base)**
- Mon/Wed/Fri: #1 Endurance Base Builder (3000-4000 yd)
- Saturday: #18 Recovery Swim (1500-2000 yd)

**Week 3-5 (Build)**
- Tue/Thu: #5 CSS Threshold Intervals (2500-3500 yd)
- Saturday: #9 Open Water Skills #3 (3500 yd)
- Sunday: #1 Endurance Base Builder (4000 yd)

**Week 6-7 (Peak)**
- Mon/Wed/Fri: #12 Sprint Speed Work (2500-3000 yd)
- Saturday: #9 Open Water Skills #3 (3500 yd)

**Week 8 (Taper)**
- Tue/Thu: #18 Recovery Swim (1500 yd)
- Saturday: #5 CSS Threshold Intervals (2500 yd)

**Total Workouts**: ~28 workouts over 8 weeks

---

## 🚀 Quick Start

1. **Open**: https://angela-coach.pages.dev/static/swim-planner?athlete=427194
2. **Select**: Start date + number of weeks
3. **Plan**: Choose workouts and yardages for each day
4. **Push**: Click "Push to TrainingPeaks"
5. **Verify**: Check TrainingPeaks calendar

---

## 📝 Next Steps (Optional Enhancements)

1. **Save Templates**: Save common week plans for reuse
2. **Copy Week**: Duplicate a week's plan to another week
3. **Preview Modal**: Show workout details before pushing
4. **Bulk Edit**: Apply same workout to multiple days
5. **More Workouts**: Add workouts #1-23 to complete library
6. **Print View**: Export week plans as PDF

---

## ✨ Confirmation

✅ **All requested features are complete**:
- [x] Workout #9 with exact descriptions (3500 yd & 2500 yd versions)
- [x] Multi-week planning (1-12 weeks)
- [x] Date picker for start week
- [x] Flexible date range selection
- [x] TrainingPeaks push working (yards → meters, markdown stripped)
- [x] Visual week headers with date ranges
- [x] Clear all weeks functionality

🎉 **Ready for production use!**

---

**Last Updated**: 2026-03-22  
**Deployment**: Production (https://angela-coach.pages.dev)  
**Repository**: https://github.com/angelanaeth/angela-coach (commit `2a56129`)

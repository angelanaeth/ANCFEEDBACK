# Accordion Week Planner - User Guide

**Commit**: `bcc6e70` (2026-03-22)  
**GitHub**: https://github.com/angelanaeth/angela-coach  
**Sandbox**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194  
**Production**: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

---

## 🎯 What You Asked For

✅ **Easy dropdown of entire weeks** - Week selector with intelligent labels  
✅ **Schedule and see each day** - Full 7-day view per week  
✅ **Up to 2 weeks viewing at a time** - Accordion shows 2 weeks simultaneously  
✅ **Confirm what you want** - Summary card shows all scheduled workouts before pushing

---

## 🖥️ New Interface Layout

### **1. Week Selection Controls**

```
┌─────────────────────────────────────────────────────────────┐
│ Select Week to Plan                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Choose Week:  [This Week (Mar 17 - Mar 23)        ▼]        │
│                                                               │
│ [◀ Previous Week]  [Next Week ▶]                            │
│                                                               │
│ Viewing: Mar 17 - Mar 30 (2 weeks)                          │
└─────────────────────────────────────────────────────────────┘
```

**Week Selector Dropdown Options**:
- This Week (Mar 17 - Mar 23)
- Next Week (Mar 24 - Mar 30)  ← **Default starting view**
- In 2 weeks (Mar 31 - Apr 6)
- In 3 weeks (Apr 7 - Apr 13)
- ...up to...
- In 23 weeks (Aug 24 - Aug 30)

**Navigation Buttons**:
- **Previous Week** ◀: Move back one week
- **Next Week** ▶: Move forward one week
- Buttons auto-disable at boundaries (can't go before current week)

---

### **2. Week Accordion View** (Shows 2 weeks)

```
┌─────────────────────────────────────────────────────────────┐
│ ▼ Mar 24 - Mar 30                              [1 workout]  │ ← Expanded
├─────────────────────────────────────────────────────────────┤
│ Day          Workout                           Yardage      │
│ Sunday       [-- Select Workout --        ▼]  [disabled]    │
│ Mar 24                                                       │
│ Monday       [#9 - Open Water Skills #3   ▼]  [3,500 yds ▼] │
│ Mar 25                                                       │
│ Tuesday      [-- Select Workout --        ▼]  [disabled]    │
│ Mar 26                                                       │
│ ...          ...                               ...          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ▶ Mar 31 - Apr 6                               [2 workouts] │ ← Collapsed
└─────────────────────────────────────────────────────────────┘
```

**Accordion Features**:
- **First week** opens automatically
- **Second week** collapsed by default
- Click header to expand/collapse
- Badge shows count: **[1 workout]**, **[2 workouts]**, **[0 workouts]**
- Badge color:
  - 🟢 Green = Has workouts
  - ⚫ Gray = No workouts

---

### **3. Schedule Summary Card**

```
┌─────────────────────────────────────────────────────────────┐
│ ✓ Schedule Summary                                           │
├─────────────────────────────────────────────────────────────┤
│ Mar 24 - Mar 30:                                            │
│   • Monday: #9 - Open Water Skills #3 (3,500 yds)          │
│                                                               │
│ Mar 31 - Apr 6:                                             │
│   • Wednesday: #5 - CSS Threshold Intervals (2,500 yds)     │
│   • Friday: #18 - Recovery Swim (1,500 yds)                │
│                                                               │
│ Total: 3 workout(s) across 2 week(s)                        │
└─────────────────────────────────────────────────────────────┘
```

**Summary Shows**:
- All scheduled workouts grouped by week
- Day, workout number, title, and yardage
- Total workout count and total weeks with workouts
- Updates in real-time as you select workouts

---

## 🔄 Workflow Example

### **Scenario: Plan 4 weeks of swimming**

#### **Step 1: Navigate to Week 1**
1. Open swim planner
2. Week selector shows "Next Week (Mar 24 - Mar 30)"
3. View shows Mar 24-30 and Mar 31-Apr 6
4. First week (Mar 24-30) is expanded

#### **Step 2: Schedule Week 1**
- Monday: #9 - Open Water Skills #3 → 3,500 yards
- Wednesday: #5 - CSS Threshold Intervals → 3,500 yards
- Friday: #1 - Endurance Base Builder → 4,000 yards

**Result**: Badge shows **[3 workouts]**

#### **Step 3: Navigate to Week 2**
- Click "Next Week ▶" button
- Now viewing Mar 31-Apr 6 and Apr 7-13
- Week 2 (Mar 31-Apr 6) is now first and expanded
- **Week 1 selections are saved** (see summary card)

#### **Step 4: Schedule Week 2**
- Tuesday: #12 - Sprint Speed Work → 3,000 yards
- Thursday: #9 - Open Water Skills #3 → 2,500 yards
- Saturday: #18 - Recovery Swim → 2,000 yards

**Result**: Badge shows **[3 workouts]**

#### **Step 5: Navigate to Week 3**
- Click "Next Week ▶" again
- Now viewing Apr 7-13 and Apr 14-20
- Schedule workouts for this week

#### **Step 6: Navigate to Week 4**
- Click "Next Week ▶" once more
- Now viewing Apr 14-20 and Apr 21-27
- Schedule workouts for this week

#### **Step 7: Review Summary**
```
Schedule Summary shows:
- Mar 24 - Mar 30: 3 workouts
- Mar 31 - Apr 6: 3 workouts
- Apr 7 - Apr 13: 2 workouts
- Apr 14 - Apr 20: 2 workouts

Total: 10 workout(s) across 4 week(s)
```

#### **Step 8: Confirm & Push**
- Review summary one last time
- Click **"Push to TrainingPeaks"** button
- Alert: "✅ Success! Pushed 10 workout(s) to TrainingPeaks"
- All 10 workouts created across 4 weeks
- Calendar refreshes to show new workouts

---

## 🎨 Visual Cues

### **Week Badges**
- **[0 workouts]** - Gray badge = empty week
- **[1 workout]** - Green badge = has training
- **[3 workouts]** - Green badge = multiple sessions

### **Dropdown States**
- **Workout dropdown enabled** = ready to select
- **Yardage dropdown disabled** = select workout first
- **Yardage dropdown enabled** = workout selected, choose distance

### **Button States**
- **"Previous Week" disabled** = at current week (can't go back)
- **"Next Week" disabled** = at last available week (24 weeks ahead)
- **"Push to TrainingPeaks" enabled** = at least 1 workout selected
- **"Clear All Weeks" enabled** = always available

---

## 🔑 Key Features

### **1. Week Navigation**
- Browse through 24 weeks (current + 23 future)
- Previous/Next buttons for quick navigation
- Dropdown for jumping to specific weeks
- Labels show relative position (This Week, Next Week, In 3 weeks)

### **2. Multi-Week Scheduling**
- Schedule workouts across multiple weeks
- Selections persist when navigating between weeks
- View 2 weeks at a time for context
- Expand/collapse weeks as needed

### **3. Real-Time Summary**
- See all scheduled workouts in one place
- Grouped by week with full details
- Total count of workouts and weeks
- Updates instantly as you make selections

### **4. Smart Defaults**
- Starts at "Next Week" (most common use case)
- First week auto-expanded for immediate use
- Second week collapsed to reduce clutter
- Can expand/collapse any week anytime

### **5. Data Persistence**
- Scheduled workouts saved across all 24 weeks
- Navigate freely without losing data
- Only clears on:
  - Manual "Clear All Weeks" click (with confirmation)
  - Successful push to TrainingPeaks
  - Page refresh

---

## 💡 Usage Tips

### **Tip 1: Schedule Entire Training Blocks**
Plan 4-8 weeks at once for a complete training cycle:
- Weeks 1-2: Base building
- Weeks 3-5: Build phase
- Weeks 6-7: Peak
- Week 8: Taper

### **Tip 2: Use Summary to Double-Check**
Before pushing:
1. Scroll to Summary card
2. Verify each week has desired workouts
3. Check total workout count
4. Confirm yardages are correct

### **Tip 3: Navigate with Keyboard**
- Tab through dropdowns
- Arrow keys in dropdowns
- Enter to select
- Much faster than mouse clicking!

### **Tip 4: Plan by Week Type**
- **High Volume Weeks**: 4-5 workouts, higher yardage
- **Recovery Weeks**: 2-3 workouts, lower yardage
- **Taper Weeks**: 1-2 workouts, moderate yardage

### **Tip 5: Copy Week Patterns**
1. Schedule Week 1 (e.g., Mon/Wed/Fri workouts)
2. Navigate to Week 3
3. Select same workouts (Mon/Wed/Fri)
4. Adjust yardages as needed
5. Creates consistent training rhythm

---

## 🧪 Testing Checklist

### **Navigation Tests**
- [ ] Week selector shows all 24 weeks
- [ ] "Next Week" is selected by default
- [ ] Previous Week button works
- [ ] Next Week button works
- [ ] Buttons disable at boundaries
- [ ] Viewing display updates correctly

### **Accordion Tests**
- [ ] Shows 2 weeks at a time
- [ ] First week auto-expanded
- [ ] Second week collapsed
- [ ] Click header to toggle expand/collapse
- [ ] Badge shows correct workout count
- [ ] Badge color changes (green/gray)

### **Scheduling Tests**
- [ ] Select workout from dropdown
- [ ] Yardage dropdown enables
- [ ] Select yardage
- [ ] Selection persists when navigating away
- [ ] Can change selections
- [ ] Can clear individual selections

### **Summary Tests**
- [ ] Summary shows "No workouts" initially
- [ ] Updates when workout added
- [ ] Shows week date range
- [ ] Shows day, workout #, title, yardage
- [ ] Shows total counts
- [ ] Updates when workout removed

### **Push Tests**
- [ ] Button disabled when no workouts
- [ ] Button enabled when 1+ workouts
- [ ] Shows spinner while pushing
- [ ] Success alert shows count
- [ ] Clears schedule after push
- [ ] Refreshes calendar to show new workouts

### **Clear Tests**
- [ ] Confirmation dialog appears
- [ ] Cancel keeps workouts
- [ ] Confirm clears all workouts
- [ ] Summary updates to "No workouts"
- [ ] All dropdowns reset

---

## 🆚 Before vs. After

### **Before (Multi-Week Table)**
- ❌ Shows all weeks at once (cluttered for 8+ weeks)
- ❌ Date picker + week count selector (2 inputs)
- ❌ No quick navigation
- ❌ No visual feedback on scheduled workouts
- ❌ Hard to see what's scheduled across weeks

### **After (Accordion View)**
- ✅ Shows 2 weeks at a time (clean, focused)
- ✅ Single week selector dropdown (1 input)
- ✅ Previous/Next buttons for quick navigation
- ✅ Badges show workout count per week
- ✅ Summary card shows all scheduled workouts
- ✅ Expand/collapse for flexibility
- ✅ Can plan up to 24 weeks ahead
- ✅ Persists selections across navigation

---

## 📊 Data Structure

### **Week Plan Object**
```javascript
weekPlan = {
  '2026-03-24': {  // Week start date (Sunday)
    days: {
      sunday: { workout: null, yardage: null },
      monday: { workout: 9, yardage: 3500 },
      tuesday: { workout: null, yardage: null },
      wednesday: { workout: 5, yardage: 3500 },
      thursday: { workout: null, yardage: null },
      friday: { workout: 1, yardage: 4000 },
      saturday: { workout: null, yardage: null }
    }
  },
  '2026-03-31': {
    days: {
      // ... similar structure
    }
  },
  // ... up to 24 weeks
}
```

### **Available Weeks Array**
```javascript
availableWeeks = [
  Date('2026-03-17'),  // This Week Sunday
  Date('2026-03-24'),  // Next Week Sunday
  Date('2026-03-31'),  // In 2 weeks Sunday
  // ... up to 24 weeks
]
```

### **Current View Index**
```javascript
currentViewWeekIndex = 1  // Next Week (default)
// Viewing weeks at index 1 and 2 (2 weeks total)
```

---

## 🎉 Summary

**What you can do now**:
1. **Browse weeks** easily with dropdown and nav buttons
2. **View 2 weeks** at a time in clean accordion layout
3. **Schedule workouts** across 24 weeks ahead
4. **See confirmation** of what's scheduled in summary card
5. **Push all at once** to TrainingPeaks (all 24 weeks if needed)

**Key improvement**: Instead of scrolling through a huge table of 8+ weeks, you now navigate week by week, seeing 2 at a time, with a clear summary of everything you've scheduled.

---

**Ready to use!** 🚀

**Test URLs**:
- Sandbox: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner?athlete=427194
- Production: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

# 🧪 Quick Test Guide - Angela Coach Platform
## Everything You Need to Test Right Now!

---

## 🎯 Main URL
**Production**: https://angela-coach.pages.dev

---

## ✅ Test 1: CSS Save (2 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194

**Steps**:
1. Click on **SWIM** tab
2. Find "Edit Critical Swim Speed" section
3. Enter CSS: `1:20` (1 minute 20 seconds per 100m)
4. Click **Save CSS**
5. **VERIFY**: No error message appears ✅
6. Refresh page - CSS value should persist ✅

**Expected Result**: CSS saves successfully, no database errors

---

## ✅ Test 2: Bike Toolkit & Save (5 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194

**Steps**:
1. Click on **BIKE** tab
2. Scroll to bottom, click **"Open Bike Toolkit"** button
3. Should open toolkit with athlete ID in URL ✅
4. Navigate to **Tab 1: Critical Power**
   - Enter CP: `263` watts
   - Enter W': `15640` joules
5. Click **Calculate**
6. Review power zones displayed
7. Click **"Save to Athlete Profile"**
8. **VERIFY**: Success message appears ✅
9. Go back to athlete profile (browser back button)
10. **VERIFY**: Power zones display on Bike tab ✅

**Expected Result**: All saves work, data persists, displays correctly

---

## ✅ Test 3: VO2 Bike Calculator (5 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194

**Steps**:
1. Navigate to **Tab 10: VO2 Bike**
2. Enter values:
   - CP: `263` watts
   - W': `15640` joules
   - pVO2max: `338` watts
3. Click **Prescribe**
4. **VERIFY**: Two workout prescriptions appear:
   - Ceiling Repeats ✅
   - Kinetics Micro-Intervals ✅
5. Review burn rate, time to exhaustion, profile type
6. Click **"Save to Athlete Profile"**
7. **VERIFY**: Success message ✅
8. Go back to athlete profile
9. Navigate to **BIKE** tab
10. Scroll to "VO2max Bike Prescription" section
11. **VERIFY**: Prescription displays with both workouts ✅

**Expected Result**: VO2 prescriptions save and display correctly

---

## ✅ Test 4: VO2 Run Calculator (5 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194

**Steps**:
1. Navigate to **Tab 11: VO2 Run**
2. Enter values:
   - Critical Speed (CS): `6:30` (6 min 30 sec per mile)
   - vVO2max: `5:15` (5 min 15 sec per mile)
   - D': `280` yards
   - Durability: **Standard**
3. Click **Prescribe**
4. **VERIFY**: Two workout prescriptions appear:
   - Classic Repeats ✅
   - Kinetics ✅
5. Review burn rate, speed gap, profile classification
6. Click **"Save to Athlete Profile"**
7. **VERIFY**: Success message ✅
8. Go back to athlete profile
9. Navigate to **RUN** tab
10. Scroll to "VO2max Run Prescription" section
11. **VERIFY**: Prescription displays with both workouts ✅

**Expected Result**: VO2 Run saves and displays correctly

---

## ✅ Test 5: Zones Sync to TrainingPeaks (3 minutes)

**Prerequisites**: 
- Athlete must have CP or LTHR set
- Coach must be connected to TrainingPeaks

**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194

**Steps**:
1. Navigate to **BIKE** tab
2. Scroll to "Power Zones" section
3. Click **"Sync to TrainingPeaks"** button (top right of zones card)
4. **VERIFY**: Button shows "Syncing..." with spinner ✅
5. Wait 2-3 seconds
6. **VERIFY**: Success message appears:
   - "Zones synced successfully!" ✅
   - Lists which zones were synced (HR/Power/Pace) ✅
7. Message auto-hides after 5 seconds ✅

**Verify in TrainingPeaks**:
1. Open TrainingPeaks
2. Go to athlete's profile
3. Check Settings → Zones
4. **VERIFY**: Power zones match calculated zones ✅
5. **VERIFY**: Heart rate zones match (if LTHR set) ✅

**Expected Result**: Zones appear in TrainingPeaks within seconds

---

## ✅ Test 6: Races Module (5 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194

**Steps**:

### Add Race:
1. Scroll to top - "Upcoming Races" section
2. Click **"Add Race"** button
3. Fill in form:
   - Name: `Ironman Chattanooga`
   - Date: (pick a future date)
   - Priority: **A Race**
   - Distance: `140.6 miles`
   - Description: `Full distance triathlon`
4. Click **Save**
5. **VERIFY**: Race card appears ✅
6. **VERIFY**: Shows countdown timer ✅
7. **VERIFY**: Red priority badge (A) ✅

### Edit Race:
1. Click pencil icon on race card
2. Change Priority to **B Race**
3. Change Distance to `70.3 miles`
4. Click **Save**
5. **VERIFY**: Badge changes to yellow ✅
6. **VERIFY**: Distance updates ✅

### Delete Race:
1. Click trash icon on race card
2. Confirm deletion
3. **VERIFY**: Race disappears ✅

### Verify TrainingPeaks:
1. Open TrainingPeaks athlete calendar
2. **VERIFY**: Race appears as event ✅
3. **VERIFY**: Priority and details match ✅

**Expected Result**: Full CRUD works, syncs to TP

---

## ✅ Test 7: Navigation Links (2 minutes)

**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194

**Steps**:

### Swim Tab:
1. Click **SWIM** tab
2. Scroll to bottom
3. **VERIFY**: "Open Swim Toolkit" button exists ✅
4. **VERIFY**: "Swim Planner" button exists ✅
5. Click "Open Swim Toolkit"
6. **VERIFY**: Opens toolkit with athlete ID ✅

### Bike Tab:
1. Go back, click **BIKE** tab
2. Scroll to bottom
3. **VERIFY**: "Open Bike Toolkit" button exists ✅
4. Click it
5. **VERIFY**: Opens toolkit with athlete ID ✅

### Run Tab:
1. Go back, click **RUN** tab
2. Scroll to bottom
3. **VERIFY**: "Open Run Toolkit" button exists ✅
4. Click it
5. **VERIFY**: Opens toolkit with athlete ID ✅

**Expected Result**: All navigation links work, athlete ID preserved

---

## ✅ Test 8: Direct Toolkit Access Prevention (1 minute)

**URL**: https://angela-coach.pages.dev/static/athlete-calculators.html
(Note: NO athlete ID in URL)

**Steps**:
1. Access URL directly (bookmark or type it)
2. **VERIFY**: Alert appears: "⚠️ No athlete selected!" ✅
3. **VERIFY**: Page redirects to coach dashboard ✅

**Expected Result**: System prevents toolkit access without athlete ID

---

## 🎯 Complete Test Checklist

Print and check off as you test:

- [ ] CSS saves without error
- [ ] Bike CP saves and displays
- [ ] Power intervals save
- [ ] VO2 Bike saves and displays
- [ ] Run CS saves and displays
- [ ] Pace intervals save
- [ ] VO2 Run saves and displays
- [ ] Zones sync to TrainingPeaks
- [ ] Zones appear in TP within seconds
- [ ] Add race works
- [ ] Edit race works
- [ ] Delete race works
- [ ] Races sync to TP
- [ ] Swim toolkit button works
- [ ] Bike toolkit button works
- [ ] Run toolkit button works
- [ ] Direct toolkit access blocked
- [ ] All athlete IDs preserved in navigation

---

## 🐛 If Something Fails

### Error: "table athlete_profiles has no column"
**Solution**: Migration didn't run - but we just ran it, so this shouldn't happen!

### Error: "No athlete ID provided"
**Solution**: Always access toolkit from athlete profile, not directly

### Error: Zones don't sync
**Check**:
1. Coach connected to TrainingPeaks?
2. Athlete has CP or LTHR set?
3. Network tab shows 401/403 error? (token expired)

### Error: Calculator doesn't save
**Check**:
1. Athlete ID in URL?
2. Network tab shows what error?
3. Console shows any JavaScript errors?

---

## 📊 Expected Time

- **Full test suite**: 30-35 minutes
- **Critical path only** (Tests 1-4): 15 minutes
- **Quick verification** (Tests 1-2): 5 minutes

---

## ✅ Success Criteria

**All tests pass = System 100% operational!**

You should be able to:
- ✅ Use all 11 toolkit calculators
- ✅ Save all data to athlete profiles
- ✅ See all saved data displayed
- ✅ Sync zones to TrainingPeaks
- ✅ Manage races with TP sync
- ✅ Navigate seamlessly between pages

---

## 🎉 After Testing

If all tests pass:
1. System is production-ready ✅
2. All features operational ✅
3. Ready for real athlete data ✅

If any test fails:
1. Note which test failed
2. Copy exact error message
3. Check browser console for errors
4. Report back and we'll fix it!

---

**Good luck with testing! 🚀**

Everything should work perfectly now since the database migration completed successfully!

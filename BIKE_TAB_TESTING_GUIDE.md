# 🚴 BIKE TAB - QUICK REFERENCE GUIDE

## 🎯 **TESTING CHECKLIST**

Use this checklist to verify all 8 bike calculators are working correctly.

---

## ✅ **1. CRITICAL POWER**

### **URL**
https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike

### **Test Data (3-Point)**
```
Short Test:  3:00 min @ 242 watts
Medium Test: 6:00 min @ 210 watts  
Long Test:   12:00 min @ 198 watts
```

### **Expected Results**
- CP ≈ 190-195 W
- W' ≈ 14-16 kJ
- FTP ≈ 180-185 W (95% of CP)
- VO2 Max Power ≈ 250-260 W

### **Profile Verification**
Go to: https://angela-coach.pages.dev/static/athlete-profile-v3?athlete=427194
- Click "Bike" tab
- Check CP metric card shows value
- Check W' metric card shows value
- Check "CP Test History" table shows new row with test data
- Click delete button to verify removal

---

## ✅ **2. BIKE POWER ZONES (EXPANDED)**

### **Test Data**
```
Critical Power: 280 watts
W': 22000 joules
Body Weight: 70 kg (optional)
```

### **Optional Test Powers**
```
5-sec: 950 W
1-min: 420 W
5-min: 335 W
20-min: 295 W
60-min: 265 W
```

### **Expected Results**
- Zone table: ZR, Sub-LT1, Z1 (Low/Mid/High), Z2 (Low/Mid/High), Sweet Spot, Z3 (Low/Mid/High), CP+
- LT1 = 202W (72% of CP)
- OGC = 244W (87% of CP)
- Power profile summary
- W' balance model

### **Profile Verification**
- Check "Power Zones Test History" table
- Verify CP, LT1, OGC values
- Check "View Zones" button appears
- Verify delete works

---

## ✅ **3. VO2 MAX INTERVALS (BIKE)**

### **Test Data**
```
Critical Power: 263 watts
W': 15640 joules
pVO₂max: 338 watts
```

### **Expected Results**
- Classic protocol (intervals with work/rest)
- Micro-interval protocol
- Duration calculations
- Power targets

### **Profile Verification**
- Check "VO₂ Max Intervals History" table
- Verify CP, W', pVO₂max values
- Check "View Protocols" button
- Verify delete works

---

## ✅ **4. BEST EFFORT WATTAGE**

### **Test Data**
```
Critical Power: 352 watts
W': 19620 joules
```

### **Expected Results**
- Interval table (1min, 2min, 3min, 5min, 10min, 20min)
- Target power for each duration
- Training ranges (90-96% of target)

### **Profile Verification**
- Check "Best Effort Wattage History" table
- Verify CP, W' values
- Check "View Targets" button
- Verify delete works

---

## ✅ **5. LOW CADENCE**

### **Test Data**
```
Target Cadence: 90 rpm
Critical Power: 280 watts
```

### **Expected Results**
- Target cadence range: 72-81 rpm (80-90% of target)
- Endurance zone: 196-224W (70-80% of CP)
- Strength zone: 224-252W (80-90% of CP)

### **Profile Verification**
- Check "Low Cadence Strength History" table
- Verify CP, cadence ranges
- Check "View Targets" button
- Verify delete works

---

## ✅ **6. CHO BURN (BIKE)**

### **Test Data**
```
Duration: 60 minutes
Power: 250 watts
```

### **Expected Results**
- Total work in kJ
- CHO burned in grams
- Fat burned in grams
- Gels needed

### **Profile Verification**
- Check "CHO Burn (Bike) History" table
- Verify duration, power, kJ, CHO values
- Verify delete works

---

## ✅ **7. TRAINING ZONES**

### **Test Data**
```
Bike CP: 280 watts (or)
Run CP: 250 watts
```

### **Expected Results**
- HR zones calculated from CP
- Zone table with ranges
- Training recommendations

### **Profile Verification**
- Check "Training Zones (LTHR) History" table
- Verify bike CP and/or run CP
- Check "View Zones" button
- Verify delete works

---

## ✅ **8. LT1/OGC ANALYSIS**

### **Test Data**
Option A: Upload .FIT file from threshold test
Option B: Manual entry with CP value

```
Critical Power: 263 watts
Resting HR: 48 bpm
Max HR: 185 bpm (or calculate from age)
Age: 35 years
```

### **Expected Results**
- LT1 detection from power/HR data
- OGC identification
- LT1 watts and HR
- OGC watts and HR
- Zone recommendations

### **Profile Verification**
- Check "LT1/OGC Analysis History" table
- Verify CP, LT1, OGC watts and HR
- Verify delete works

---

## 🎨 **EXPECTED PROFILE DISPLAY**

When you open the profile page and click the "Bike" tab, you should see:

### **Top Row - Metric Cards**
```
┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
│ CP: 280W     │  │ W': 22,000 J │  │ PVO2max: 338W   │
│ Calculator   │  │ Calculated   │  │ VO2 Calculator  │
│ Updated: ... │  │              │  │                 │
└──────────────┘  └──────────────┘  └─────────────────┘
```

### **Second Row - Threshold Metrics**
```
┌──────────────────────┐  ┌──────────────────────┐
│ LT1: 202W            │  │ OGC: 244W            │
│ (72% of CP)          │  │ (87% of CP)          │
│ LT1/OGC Test         │  │ LT1/OGC Test         │
└──────────────────────┘  └──────────────────────┘
```

### **Test History Tables**
8 expandable tables showing all historical tests with:
- Date
- Key metrics (CP, W', power, etc.)
- Test data (inputs used)
- Source (calculator/manual)
- Actions (View, Edit, Delete buttons)

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Calculator doesn't save**
**Check:**
- Is athleteId set? (Look for `window.athleteId` in console)
- Does browser show network errors in DevTools?
- Check console for error messages

### **Issue: Test doesn't appear in history**
**Check:**
- Refresh the profile page after saving
- Look in browser DevTools Network tab for API calls
- Check if POST to `/api/athlete-profile/:id/test-history` succeeded

### **Issue: Delete button doesn't work**
**Check:**
- Look for confirmation dialog
- Check console for errors
- Verify DELETE request in Network tab

### **Issue: Metric cards don't update**
**Check:**
- Profile page needs refresh after calculator save
- Check if `updateBikeMetricCards()` function is called
- Look for console errors

---

## 📊 **DATA VERIFICATION**

### **Check Database (Local)**
```bash
cd /home/user/webapp
npx wrangler d1 execute angela-db-production --local --command="SELECT * FROM bike_cp_history ORDER BY created_at DESC LIMIT 5"
```

### **Check API Response**
```bash
# Get test history
curl https://angela-coach.pages.dev/api/athlete-profile/427194/test-history/bike-cp

# Save test (replace with actual data)
curl -X POST https://angela-coach.pages.dev/api/athlete-profile/427194/test-history \
  -H "Content-Type: application/json" \
  -d '{"calculator_type":"bike-cp","test_date":"2026-04-13T12:00:00Z","cp_watts":280,"w_prime":22000,"source":"calculator"}'
```

---

## 🎓 **UNDERSTANDING THE SYSTEM**

### **Data Flow**
```
Calculator Form
    ↓ (user enters data)
Calculate Button
    ↓ (computes results)
Save Button
    ↓ (captures inputs + outputs)
POST to API
    ↓ (saves to database)
Profile Page
    ↓ (loads test history)
Display Tables
    ↓ (renders with delete buttons)
User Can Delete
```

### **Database Tables**
Each calculator has its own table:
- `bike_cp_history` - Critical Power tests
- `bike_zones_history` - Power zone calculations
- `bike_vo2_history` - VO2 interval prescriptions
- `bike_best_effort_history` - Best effort wattage
- `bike_low_cadence_history` - Low cadence targets
- `bike_cho_history` - CHO burn calculations
- `bike_training_zones_history` - Training zone data
- `bike_lt1_ogc_history` - LT1/OGC analysis

### **API Endpoints**
- `POST /api/athlete-profile/:id/test-history` - Save test
- `GET /api/athlete-profile/:id/test-history/:type` - Get history
- `DELETE /api/athlete-profile/:id/test-history/:testId` - Delete test

---

## ✅ **COMPLETION CHECKLIST**

Print this and check off as you test:

- [ ] Critical Power calculator saves and displays
- [ ] Bike Power Zones calculator saves and displays
- [ ] VO2 Max Intervals calculator saves and displays
- [ ] Best Effort Wattage calculator saves and displays
- [ ] Low Cadence calculator saves and displays
- [ ] CHO Burn calculator saves and displays
- [ ] Training Zones calculator saves and displays
- [ ] LT1/OGC calculator saves and displays
- [ ] All metric cards display correctly
- [ ] LT1 shows % of CP
- [ ] OGC shows % of CP
- [ ] Delete buttons work on all tables
- [ ] Page loads without JavaScript errors
- [ ] No 404 errors in console (except missing athlete data)

---

## 🎉 **SUCCESS CRITERIA**

You'll know everything is working when:
1. ✅ You can use any calculator and save results
2. ✅ Saved results appear in the correct history table
3. ✅ Metric cards update with latest values
4. ✅ Delete buttons remove tests
5. ✅ No JavaScript errors in console
6. ✅ API calls succeed (check Network tab)
7. ✅ Test data includes both inputs and outputs
8. ✅ Timestamps show when tests were saved

---

**Ready to test!** 🚴‍♂️

Start with Critical Power calculator as your first test - it's the most straightforward to verify.

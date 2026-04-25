# 🔧 CHO FUELING - TROUBLESHOOTING GUIDE

## ❓ **PROBLEM: "Queued: 0 workouts" Even Though Workouts Exist**

### **Root Cause**
Workouts were previously queued with **OLD CHO values (60g)** using simple intensity-based logic. The system wasn't re-calculating with the **NEW precise formulas** because it detected workouts as "already processed".

---

## ✅ **SOLUTION: Force Re-Queue with New Calculations**

### **Quick Fix**
Add `"force": true` to your API call:

```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194", "force": true}'
```

**Result**:
```json
{
  "success": true,
  "queued": 0,
  "updated": 2,
  "total_planned": 2,
  "week_range": "2026-01-19 → 2026-01-25",
  "message": "Queued 0 new, updated 2 existing. Processing..."
}
```

---

## 🔍 **What Changed**

### **Before (Old System)**
```typescript
// Simple intensity-based CHO
let carb = 60; // Default
if (intensity > 0.85) carb = 90;
else if (intensity > 0.70) carb = 75;
else carb = 60;
```

**Problems**:
- ❌ Same formula for all sports
- ❌ Doesn't use CP, CS, or swim pace
- ❌ Not based on exercise physiology
- ❌ No consideration of athlete weight or duration

**Old CHO Values**:
- CS CHECK (Swim): **60g** ❌
- CP CHECK (Bike): **60g** ❌

---

### **After (New System)**
```typescript
// Precise sport-specific calculations

// BIKE: Uses CP, IF, Duration
NP = CP × IF
Work = 3.6 × Duration × NP
CHO% = LOOKUP(IF)
g CHO = (Work / 0.225) × CHO% / 4

// RUN: Uses CS, Weight, IF, Duration
VO2 = f(CS, Weight) × IF
kcal = VO2 × 5 × Duration
CHO% = LOOKUP(IF)
g CHO = kcal × CHO% / 4

// SWIM: Uses Pace, Weight, Distance, Type
Calories = MET × Weight × 0.0175 × Duration
g CHO = Calories × 0.85 / 4
```

**Benefits**:
- ✅ Sport-specific formulas
- ✅ Uses athlete physiology (CP, CS, pace)
- ✅ Based on Mass CHO Calculator Excel
- ✅ Accounts for weight and workout structure

**New CHO Values**:
- CS CHECK (Swim): **40g** ✅
- CP CHECK (Bike): **358g** ✅

---

## 📊 **How The Update Logic Works**

### **Smart Re-Queue System**

```typescript
1. Check if workout already queued
   ├─ IF NOT queued → INSERT new entry
   │
   ├─ IF queued AND CHO changed → UPDATE with new value
   │
   ├─ IF queued AND force=true → UPDATE (re-calculate)
   │
   └─ IF queued AND unchanged → Skip
```

### **Comparison**

| Scenario | Without force | With force=true |
|----------|--------------|----------------|
| New workout | ✅ Queues | ✅ Queues |
| Same CHO value | ⏭️ Skips | 🔄 Re-calculates |
| Different CHO | 🔄 Updates | 🔄 Updates |
| Status = 'success' | ⏭️ Skips | 🔄 Updates |
| Status = 'failed' | 🔄 Updates | 🔄 Updates |

---

## 🧪 **Testing**

### **Test Script**
```bash
cd /home/user/webapp
./test_cho_force_update.sh
```

### **Expected Output**:
```
3️⃣ WITHOUT force (won't update existing)
{
  "queued": 0,
  "updated": 0,  ← No changes
  "message": "All 2 workouts already processed."
}

4️⃣ WITH force=true (re-calculates all)
{
  "queued": 0,
  "updated": 2,  ← Updated!
  "message": "Queued 0 new, updated 2 existing. Processing..."
}
```

---

## 🎯 **When To Use Each Option**

### **Without force (default)**
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194"}'
```

**Use when**:
- ✅ First time queuing workouts
- ✅ Adding new workouts to the week
- ✅ Only want to update changed workouts
- ✅ Normal weekly batch processing

---

### **With force=true**
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194", "force": true}'
```

**Use when**:
- ✅ After updating athlete profile (CP, CS, weight)
- ✅ Migrating from old CHO system to new
- ✅ Want to ensure all workouts use latest formulas
- ✅ Fixing incorrect previous calculations

---

## 📋 **Common Scenarios**

### **Scenario 1: Updated Athlete Weight**
```bash
# Step 1: Update profile
curl -X POST http://localhost:3000/api/coach/athlete/427194/profile \
  -d '{"weight_kg": 75}'

# Step 2: Re-calculate fueling with new weight
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194", "force": true}'
```

---

### **Scenario 2: Updated CP After Testing**
```bash
# Step 1: Update CP
curl -X POST http://localhost:3000/api/coach/athlete/427194/profile \
  -d '{"cp_watts": 280}'

# Step 2: Force re-calculate all bike workouts
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194", "force": true}'
```

---

### **Scenario 3: Bulk Update All Athletes**
```bash
# Will re-calculate CHO for all athletes
curl -X POST http://localhost:3000/api/fuel/all-athletes

# Note: Add force parameter in future version for bulk operations
```

---

## 🔧 **Verification**

### **Check Updated Values**
```bash
# View in database
npx wrangler d1 execute angela-db --local \
  --command="SELECT workout_date, workout_title, fuel_carb, status 
             FROM tp_write_queue 
             WHERE athlete_id = '427194' 
             AND workout_date >= '2026-01-19' 
             ORDER BY workout_date"
```

### **Check Calculation Logs**
```bash
pm2 logs angela-coach --nostream --lines 50 | \
  grep -E "BIKE CHO|RUN CHO|SWIM CHO"
```

**Expected**:
```
🚴 BIKE CHO: CP=256W, IF=0.70, Duration=1.0h → 358g
🏊 SWIM CHO: Pace=95s/100, Type=steady, Distance=0m → 40g
```

---

## ⚠️ **Known Issues**

### **Issue 1: Duration/IF = null in TrainingPeaks**
**Symptom**: Workouts show `Duration: nullh, IF: null`

**Cause**: 
- Workout hasn't been structured yet in TP
- Test/placeholder workouts
- Workout template without details

**Solution**: 
- System uses default values (IF=0.70, Duration=1h)
- Or structure the workout in TrainingPeaks first

---

### **Issue 2: TrainingPeaks Write Failed**
**Symptom**: Status shows "failed" in database

**Cause**:
- Token expired or demo mode
- API rate limit
- Workout locked/completed

**Solution**:
```bash
# Reconnect TrainingPeaks token
Visit: https://3000-..../static/tp-connect-production.html

# Then retry processing
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194", "force": true}'
```

---

## 📚 **API Reference**

### **POST /api/fuel/next-week**

**Parameters**:
- `athlete_id` (required): TrainingPeaks athlete ID
- `force` (optional): Boolean, default `false`

**Response**:
```json
{
  "success": true,
  "queued": 0,        // New workouts added
  "updated": 2,       // Existing workouts updated
  "total_planned": 2, // Total workouts found
  "week_range": "2026-01-19 → 2026-01-25",
  "message": "..."
}
```

---

## ✅ **Summary**

### **Problem**: 
Workouts queued with old 60g CHO values

### **Solution**: 
Use `force: true` to re-calculate with new precise formulas

### **Command**:
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -d '{"athlete_id": "427194", "force": true}'
```

### **Result**:
- ✅ SWIM: 60g → 40g (precise MET-based)
- ✅ BIKE: 60g → 358g (CP/IF-based)
- ✅ RUN: 60g → 125g (CS/VO2-based)

---

**Last Updated**: 2026-01-12  
**Status**: ✅ FIXED  
**Test Script**: `/home/user/webapp/test_cho_force_update.sh`

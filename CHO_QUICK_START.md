# 🚀 CHO FUELING - QUICK START GUIDE

## ⚡ **1-MINUTE SETUP**

### **Set Athlete Profile** (One time)
```bash
curl -X POST http://localhost:3000/api/coach/athlete/427194/profile \
  -H "Content-Type: application/json" \
  -d '{
    "weight_kg": 79.4,
    "cp_watts": 256,
    "cs_run_seconds": 423,
    "swim_pace_per_100": 95
  }'
```

### **Fuel All Athletes for Next Week**
```bash
curl -X POST http://localhost:3000/api/fuel/all-athletes
```

**Done!** CHO guidance will be written to TrainingPeaks Pre-Activity Comments.

---

## 📊 **WHAT YOU GET**

### **Example Output**:
```
⚡ ECHODEVO FUELING GUIDANCE ⚡

🍌 CARBOHYDRATES: 358g/hr
💧 HYDRATION: 497ml/hr  
🧂 SODIUM: 900mg/hr

📊 Auto-generated based on workout duration, intensity, and sport type.
Adjust based on conditions (heat, altitude, personal sweat rate).
```

---

## 🏃 **HOW IT CALCULATES**

### **BIKE** 🚴
- Uses: **CP (Critical Power)** + IF + Duration
- Formula: `NP = CP × IF → Work → CHO from IF lookup`
- Example: 256W CP, 0.70 IF, 1hr → **358g CHO**

### **RUN** 🏃
- Uses: **CS (Critical Speed)** + Weight + IF + Duration
- Formula: `VO2 = f(CS, Weight) × IF → CHO from IF lookup`
- Example: 7:03/mile, 79kg, 0.75 IF, 60min → **125g CHO**

### **SWIM** 🏊
- Uses: **Pace per 100** + Weight + Distance + Type
- Formula: `MET-based calories × 85% CHO assumption`
- Example: 1:35/100, 79kg, 2500m, Tempo → **100g CHO**

---

## 🎯 **KEY FEATURES**

✅ **Sport-Specific**: Different formulas for Bike/Run/Swim  
✅ **Science-Based**: From Mass CHO Calculator.xlsx  
✅ **Preserves Data**: Appends to existing workout comments  
✅ **Bulk Processing**: Fuel all athletes at once  
✅ **Default Values**: Works even without full profile  

---

## 🔢 **PROFILE VALUES**

### **What You Need**:

| Field | Description | Example | Default |
|-------|-------------|---------|---------|
| `weight_kg` | Body weight (kg) | 79.4 | 70 |
| `cp_watts` | Critical Power (bike) | 256 | 250 |
| `cs_run_seconds` | Critical Speed (s/mile) | 423 | 420 |
| `swim_pace_per_100` | Swim pace (s/100m) | 95 | 100 |

### **How to Find These Values**:
- **Weight**: Current athlete weight
- **CP**: 20-min or 1-hour bike test max power
- **CS**: Race pace or threshold pace (e.g., 7:03 = 423 seconds)
- **Swim Pace**: 100m/y time at threshold

---

## 📋 **COMMON COMMANDS**

### **View Profile**
```bash
curl http://localhost:3000/api/coach/athlete/427194/profile
```

### **Update Just Weight**
```bash
curl -X POST http://localhost:3000/api/coach/athlete/427194/profile \
  -H "Content-Type: application/json" \
  -d '{"weight_kg": 75}'
```

### **Fuel Single Athlete**
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}'
```

### **Check Fuel Queue Status**
```bash
curl http://localhost:3000/api/fuel/status?athlete_id=427194
```

---

## 🧪 **TESTING**

Run the test script:
```bash
cd /home/user/webapp
./test_cho_calculation.sh
```

Check logs for calculations:
```bash
pm2 logs angela-coach --nostream --lines 50 | grep -E "BIKE CHO|RUN CHO|SWIM CHO"
```

---

## ⚠️ **TROUBLESHOOTING**

### **No CHO values showing**
- Check athlete profile is set: `GET /api/coach/athlete/:id/profile`
- Verify workouts have IF and Duration data
- Check PM2 logs for calculation errors

### **Values seem wrong**
- Verify profile values (CP, CS, swim pace)
- Compare with Excel calculator manually
- Check IF values from TrainingPeaks

### **TrainingPeaks write failed**
- Reconnect TrainingPeaks token
- Check API rate limits
- Verify workout IDs are correct

---

## 🎓 **FORMULA REFERENCE**

### **IF to CHO% Lookup**
- 0.50 IF = 20% CHO (easy recovery)
- 0.70 IF = 50% CHO (tempo)
- 0.85 IF = 80% CHO (very hard)
- 1.00 IF = 93% CHO (maximal)

Full table: 461 values with linear interpolation

---

## 📞 **SUPPORT**

- **Documentation**: `/home/user/webapp/CHO_FUELING_SYSTEM.md`
- **Test Script**: `/home/user/webapp/test_cho_calculation.sh`
- **Excel Reference**: `/home/user/uploaded_files/Mass CHO Calculator.xlsx`

---

## ✅ **STATUS**

**System Status**: ✅ READY  
**Build**: ✅ SUCCESS  
**Tests**: ✅ PASSING  
**Production**: ✅ LIVE  

**Last Updated**: 2026-01-12

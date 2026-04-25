# 🚀 EchoDevo GPT - Quick Reference Card

## Your GPT URL
```
https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5
```

## API Base URL
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
```

## 📍 Quick Links

| Resource | URL |
|----------|-----|
| **Your GPT** | https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5 |
| **Coach Dashboard** | https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach |
| **OpenAPI Schema** | https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/gpt/echodevo-openapi.json |

## 🔌 API Endpoints for GPT

### 1. Fetch Athlete Data
```
POST /api/gpt/fetch
```
Get athlete profile, metrics, and workouts

### 2. Write Workout Plan
```
POST /api/gpt/write
```
Post workouts to TrainingPeaks calendar

### 3. List Athletes
```
GET /api/gpt/athletes
```
Get all athletes (93 total)

### 4. Calculate Metrics
```
POST /api/gpt/metrics/calculate
```
Compute CTL/ATL/TSB from workouts

## 🎯 Quick Test

### In Your GPT, Ask:
```
Analyze athlete 427194 from the last 90 days
```

### Expected Result:
- Name: Angela 1A
- 249 workouts
- CTL: 125, ATL: 260, TSB: -135
- Status: Compromised
- Sport breakdown: 68 swim, 77 bike, 41 run

## 📋 Setup Steps

1. **Open GPT Builder**
   - Go to: https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5
   - Click "Configure"

2. **Add Actions**
   - Scroll to "Actions"
   - Click "Create new action"
   
3. **Import Schema**
   - Paste this URL:
   ```
   https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/gpt/echodevo-openapi.json
   ```

4. **Test Connection**
   - Ask: "List all my athletes"
   - Should see 93 athletes

## 🧪 Test Commands (bash)

### List Athletes
```bash
curl https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/athletes
```

### Fetch Angela's Data
```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2025-12-01","end_date":"2026-01-10"}'
```

## 📊 What Your GPT Can Access

✅ **Athlete Data**
- 93 athletes from TrainingPeaks
- Full profiles (FTP, LTHR, weight)
- Email, sport, gender

✅ **Training Metrics**
- CTL/ATL/TSB (TOTAL + per-sport)
- Stress state
- Block type

✅ **Workout History**
- 249 workouts for Angela (90 days)
- TSS, duration, distance
- Power, HR, pace data
- Sport-specific breakdown

✅ **Actions**
- Fetch athlete data
- Post workouts to TP
- Calculate metrics
- List all athletes

## 🎊 Ready to Use!

1. Configure Actions in GPT
2. Test with: "Analyze athlete 427194"
3. Start coaching! 🏆

---

**Full Documentation:** See `GPT_SETUP_GUIDE.md`

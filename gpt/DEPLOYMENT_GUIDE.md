# 🚀 ECHODEVO COACH GPT - Complete Deployment Guide

**Version:** 2.0 (Angela Engine v5.1 + TrainingPeaks)  
**Date:** January 9, 2026  
**Status:** Ready for Deployment

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Files Checklist](#files-checklist)
3. [Backend Setup](#backend-setup)
4. [GPT Configuration](#gpt-configuration)
5. [Testing](#testing)
6. [Deployment Steps](#deployment-steps)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide covers the complete deployment of **EchoDevo Coach GPT**, an AI coaching assistant that:
- Connects directly to TrainingPeaks via OAuth
- Analyzes training data using Angela Engine v5.1 logic
- Provides adaptive coaching recommendations
- Operates in both Coach and Athlete modes

**Architecture:**
```
User → GPT Interface → OpenAPI Gateway → Backend API → TrainingPeaks API
                    ↓
              Angela Brain Logic
```

---

## 📁 Files Checklist

### ✅ Core Files (Already Created)

Located in `/home/user/webapp/gpt/`:

| File | Purpose | Status |
|------|---------|--------|
| `echodevo_gpt_instructions.md` | GPT system prompt & logic | ✅ Complete |
| `echodevo-openapi.json` | API spec for GPT connection | ✅ Complete |
| `../src/echodevo/angela_brain.txt` | Full Angela Engine v5.1 framework | ✅ Complete |
| `../src/echodevo/echodevo_brain.txt` | Operational instructions | ✅ Complete |

### 🔧 Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `gpt-manifest.json` | GPT metadata | High |
| Backend `/api/gpt/*` endpoints | Data fetching & writing | High |
| CTL/ATL calculation module | Metrics computation | Medium |
| Testing suite | Validation | Medium |

---

## 🛠️ Backend Setup

### Required API Endpoints

You need to implement these 4 endpoints in `/home/user/webapp/src/index.tsx`:

#### 1. **POST /api/gpt/fetch** - Fetch Athlete Data

```typescript
app.post('/api/gpt/fetch', async (c) => {
  const { athlete_id, start_date, end_date, include_planned } = await c.req.json();
  const { DB, TP_API_BASE_URL } = c.env;
  
  try {
    // Get athlete's TrainingPeaks token
    const athlete = await DB.prepare(`
      SELECT * FROM users WHERE tp_athlete_id = ?
    `).bind(athlete_id).first();
    
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    // Fetch workouts from TrainingPeaks
    const workoutsUrl = `${TP_API_BASE_URL}/v2/athlete/${athlete_id}/workouts?startDate=${start_date}&endDate=${end_date}`;
    const response = await fetch(workoutsUrl, {
      headers: {
        'Authorization': `Bearer ${athlete.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`TrainingPeaks API error: ${response.status}`);
    }
    
    const workouts = await response.json();
    
    // Fetch current metrics (CTL/ATL/TSB)
    const metricsUrl = `${TP_API_BASE_URL}/v2/athlete/${athlete_id}/fitness`;
    const metricsResponse = await fetch(metricsUrl, {
      headers: {
        'Authorization': `Bearer ${athlete.access_token}`
      }
    });
    
    const metrics = metricsResponse.ok ? await metricsResponse.json() : null;
    
    // If metrics not available from TP, calculate from DB
    let ctl = metrics?.ctl || 0;
    let atl = metrics?.atl || 0;
    let tsb = ctl - atl;
    
    if (!metrics) {
      // Fetch last 90 days of training_metrics
      const dbMetrics = await DB.prepare(`
        SELECT ctl, atl, tsb FROM training_metrics
        WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
        ORDER BY date DESC LIMIT 1
      `).bind(athlete_id).first();
      
      if (dbMetrics) {
        ctl = dbMetrics.ctl;
        atl = dbMetrics.atl;
        tsb = dbMetrics.tsb;
      }
    }
    
    // Normalize to canonical format
    const normalized = {
      athlete: {
        id: athlete_id,
        name: athlete.name,
        email: athlete.email,
        sport: athlete.sport || 'triathlon',
        ftp: athlete.ftp,
        cp: athlete.cp,
        cs: athlete.cs,
        lactate_threshold_hr: athlete.hr_threshold
      },
      metrics: {
        ctl: ctl,
        atl: atl,
        tsb: tsb,
        hrv: null, // Fetch from wellness_data if available
        rhr: null,
        weight_kg: athlete.weight_kg,
        sleep_hours: null,
        sleep_quality: null,
        readiness_score: null
      },
      workouts: workouts.map((w: any) => ({
        date: w.WorkoutDay,
        sport: mapSport(w.WorkoutType),
        title: w.Title,
        description: w.Description,
        duration: w.TotalTime / 60, // Convert to minutes
        distance: w.Distance,
        tss: w.TSS,
        if: w.IntensityFactor,
        np: w.NormalizedPower,
        avg_power: w.PowerAvg,
        avg_hr: w.HeartRateAvg,
        avg_pace: w.PaceAvg,
        elevation_gain: w.ElevationGain,
        completed: w.Completed,
        planned: w.Planned || false
      })),
      date_range: {
        start: start_date,
        end: end_date
      }
    };
    
    return c.json(normalized);
    
  } catch (error: any) {
    console.error('Error fetching athlete data:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Helper function to map TrainingPeaks workout types
function mapSport(workoutType: string): string {
  const type = workoutType.toLowerCase();
  if (type.includes('bike') || type.includes('cycle')) return 'bike';
  if (type.includes('run')) return 'run';
  if (type.includes('swim')) return 'swim';
  if (type.includes('brick')) return 'brick';
  if (type.includes('strength')) return 'strength';
  return 'other';
}
```

#### 2. **POST /api/gpt/write** - Write Workout Plan

```typescript
app.post('/api/gpt/write', async (c) => {
  const { athlete_id, workouts } = await c.req.json();
  const { DB, TP_API_BASE_URL } = c.env;
  
  try {
    // Get athlete's token
    const athlete = await DB.prepare(`
      SELECT * FROM users WHERE tp_athlete_id = ?
    `).bind(athlete_id).first();
    
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    const createdWorkouts = [];
    
    for (const workout of workouts) {
      // Post to TrainingPeaks
      const tpWorkout = {
        WorkoutDay: workout.date,
        WorkoutTypeId: getWorkoutTypeId(workout.sport),
        Title: workout.title,
        Description: workout.description,
        PlannedDuration: workout.duration * 60, // Convert to seconds
        PlannedTSS: workout.tss,
        CoachComments: workout.coach_notes || ''
      };
      
      const response = await fetch(`${TP_API_BASE_URL}/v2/workouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${athlete.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tpWorkout)
      });
      
      if (response.ok) {
        const created = await response.json();
        createdWorkouts.push(created.WorkoutId);
        
        // Store in local DB
        await DB.prepare(`
          INSERT INTO posted_workouts 
          (user_id, tp_workout_id, date, title, description, tss, duration, sport, posted_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          athlete.id,
          created.WorkoutId,
          workout.date,
          workout.title,
          workout.description,
          workout.tss,
          workout.duration,
          workout.sport
        ).run();
      }
    }
    
    return c.json({
      status: 'success',
      workouts_created: createdWorkouts.length,
      workout_ids: createdWorkouts
    });
    
  } catch (error: any) {
    console.error('Error writing workouts:', error);
    return c.json({ error: error.message }, 500);
  }
});

function getWorkoutTypeId(sport: string): number {
  // TrainingPeaks workout type IDs
  const types: {[key: string]: number} = {
    'bike': 1,
    'run': 2,
    'swim': 3,
    'brick': 4,
    'strength': 5,
    'other': 0
  };
  return types[sport] || 0;
}
```

#### 3. **GET /api/gpt/athletes** - List Athletes (Coach Mode)

```typescript
app.get('/api/gpt/athletes', async (c) => {
  const { DB, TP_API_BASE_URL } = c.env;
  
  try {
    // Get coach account
    const coach = await DB.prepare(`
      SELECT * FROM users 
      WHERE account_type = 'coach' 
      ORDER BY created_at DESC LIMIT 1
    `).first();
    
    if (!coach) {
      return c.json({ error: 'No coach account found' }, 401);
    }
    
    // Fetch athletes from TrainingPeaks
    const response = await fetch(`${TP_API_BASE_URL}/v1/coach/athletes`, {
      headers: {
        'Authorization': `Bearer ${coach.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`TrainingPeaks API error: ${response.status}`);
    }
    
    const tpAthletes = await response.json();
    
    // Enrich with local DB data
    const enriched = await Promise.all(
      tpAthletes.map(async (athlete: any) => {
        const metrics = await DB.prepare(`
          SELECT ctl, atl, tsb, date, block_type 
          FROM training_metrics
          WHERE user_id IN (SELECT id FROM users WHERE tp_athlete_id = ?)
          ORDER BY date DESC LIMIT 1
        `).bind(String(athlete.Id)).first();
        
        return {
          id: String(athlete.Id),
          name: `${athlete.FirstName} ${athlete.LastName}`.trim(),
          email: athlete.Email,
          sport: 'triathlon', // Default
          current_ctl: metrics?.ctl || null,
          current_atl: metrics?.atl || null,
          current_tsb: metrics?.tsb || null,
          last_workout: metrics?.date || null,
          current_block: metrics?.block_type || null
        };
      })
    );
    
    return c.json({
      athletes: enriched,
      total: enriched.length
    });
    
  } catch (error: any) {
    console.error('Error listing athletes:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

#### 4. **POST /api/gpt/metrics/calculate** - Calculate CTL/ATL/TSB

```typescript
app.post('/api/gpt/metrics/calculate', async (c) => {
  const { athlete_id, workouts } = await c.req.json();
  
  try {
    // Sort workouts by date
    const sorted = workouts.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // EWMA calculation
    let ctl = 0;
    let atl = 0;
    
    for (const workout of sorted) {
      const tss = workout.tss || 0;
      ctl = ctl + (tss - ctl) / 42;
      atl = atl + (tss - atl) / 7;
    }
    
    const tsb = ctl - atl;
    
    return c.json({
      ctl: Math.round(ctl * 10) / 10,
      atl: Math.round(atl * 10) / 10,
      tsb: Math.round(tsb * 10) / 10,
      calculated_date: sorted[sorted.length - 1]?.date || new Date().toISOString().split('T')[0]
    });
    
  } catch (error: any) {
    console.error('Error calculating metrics:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

---

## 🤖 GPT Configuration

### Step 1: Create GPT in GenSpark/ChatGPT

1. Go to ChatGPT > Explore GPTs > Create
2. Name: **EchoDevo Coach**
3. Description: 
   ```
   Elite AI endurance coaching assistant for triathlon, cycling, and running. 
   Powered by Angela Engine v5.1 with TrainingPeaks integration.
   ```

### Step 2: Upload Instructions

- Copy entire contents of `/home/user/webapp/gpt/echodevo_gpt_instructions.md`
- Paste into "Instructions" field

### Step 3: Upload Knowledge Files

Upload these two files to "Knowledge":
1. `/home/user/webapp/src/echodevo/angela_brain.txt` (Angela Engine v5.1 - 1,681 lines)
2. `/home/user/webapp/src/echodevo/echodevo_brain.txt` (Operational instructions)

### Step 4: Configure Actions

1. Click "Create new action"
2. Import from URL: Upload `/home/user/webapp/gpt/echodevo-openapi.json`
3. Or paste JSON directly
4. Authentication: None (handled by backend OAuth)
5. Privacy: External users allowed (if sharing)

### Step 5: Conversation Starters

Add these starter prompts:
```
1. "Analyze my last 2 weeks of training"
2. "What should I do today?"
3. "Create my weekly training plan"
4. "Calculate my fueling for a 3-hour ride"
5. "When should I transition to my next block?"
```

### Step 6: Capabilities

Enable:
- ✅ Web Browsing (OFF - use only Angela logic)
- ✅ DALL-E Image Generation (OFF)
- ✅ Code Interpreter (ON - for calculations)

---

## 🧪 Testing

### Test Cases

#### Test 1: Basic Data Fetch
```json
POST /api/gpt/fetch
{
  "athlete_id": "427194",
  "start_date": "2026-01-01",
  "end_date": "2026-01-09"
}
```

**Expected Response:**
- Athlete object with name, FTP, etc.
- Metrics with CTL/ATL/TSB
- Array of workouts
- Date range confirmation

#### Test 2: CTL/ATL Calculation
```json
POST /api/gpt/metrics/calculate
{
  "athlete_id": "427194",
  "workouts": [
    {"date": "2026-01-01", "tss": 100},
    {"date": "2026-01-02", "tss": 120},
    {"date": "2026-01-03", "tss": 0},
    {"date": "2026-01-04", "tss": 150}
  ]
}
```

**Expected Response:**
- Calculated CTL (slowly increasing)
- Calculated ATL (more variable)
- TSB = CTL - ATL

#### Test 3: GPT Analysis

Send to GPT:
```
Analyze athlete 427194 from Jan 1-9, 2026
```

**Expected GPT Response:**
- Current readiness state (TSB interpretation)
- Block recommendation
- Today's session prescription
- Fueling plan
- Coach note

---

## 🚀 Deployment Steps

### 1. Backend Deployment

```bash
cd /home/user/webapp

# Add GPT endpoints to src/index.tsx
# (Copy code from Backend Setup section above)

# Build and restart
npm run build
pm2 restart angela-coach

# Test endpoints
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2026-01-01","end_date":"2026-01-09"}'
```

### 2. GPT Deployment

1. **Create GPT** in GenSpark/ChatGPT
2. **Upload files:**
   - Instructions: `echodevo_gpt_instructions.md`
   - Knowledge: `angela_brain.txt`, `echodevo_brain.txt`
3. **Configure OpenAPI:** `echodevo-openapi.json`
4. **Test connection** with sample queries
5. **Publish** (private or public)

### 3. Production Deployment

When ready for production:

1. Deploy to Cloudflare Pages
2. Update OpenAPI server URL to production
3. Configure production TrainingPeaks OAuth
4. Update GPT actions with production URL
5. Test thoroughly with real athletes

---

## 🔧 Troubleshooting

### Common Issues

**1. "Athlete not found"**
- Solution: Verify athlete has connected TrainingPeaks OAuth
- Check `users` table for athlete record

**2. "TrainingPeaks API error: 401"**
- Solution: Token expired, need to refresh
- Implement token refresh logic

**3. "No CTL/ATL data"**
- Solution: Use `/api/gpt/metrics/calculate`
- Ensure workouts have TSS values

**4. GPT gives vague responses**
- Solution: Check if data is reaching GPT correctly
- Verify OpenAPI connection
- Ensure Angela brain files are uploaded

**5. "Invalid workout type"**
- Solution: Check sport mapping in `mapSport()` function
- Verify TrainingPeaks workout type IDs

---

## 📊 Performance Monitoring

### Metrics to Track

- **API Response Time:** < 2 seconds
- **GPT Response Time:** < 10 seconds
- **Data Fetch Success Rate:** > 95%
- **Workout Write Success Rate:** > 99%
- **User Satisfaction:** Monitor feedback

### Logging

Add logging to track:
```typescript
console.log(`[GPT] Fetch request for athlete ${athlete_id}`);
console.log(`[GPT] Returned ${workouts.length} workouts`);
console.log(`[GPT] Metrics: CTL=${ctl}, ATL=${atl}, TSB=${tsb}`);
```

---

## 📚 Additional Resources

### Documentation

- **Angela Engine v5.1:** `/home/user/webapp/src/echodevo/angela_brain.txt`
- **TrainingPeaks API:** https://developers.trainingpeaks.com/
- **OpenAPI Spec:** `/home/user/webapp/gpt/echodevo-openapi.json`

### Support Files

All files located in `/home/user/webapp/gpt/`:
- `echodevo_gpt_instructions.md` (14KB)
- `echodevo-openapi.json` (17KB)
- `../src/echodevo/angela_brain.txt` (1,681 lines)
- `../src/echodevo/echodevo_brain.txt` (existing)

---

## ✅ Deployment Checklist

Before going live:

- [ ] Backend endpoints implemented
- [ ] CTL/ATL calculation working
- [ ] TrainingPeaks OAuth configured
- [ ] GPT created in GenSpark
- [ ] Instructions uploaded
- [ ] Knowledge files uploaded
- [ ] OpenAPI configured
- [ ] Test cases passed
- [ ] Error handling tested
- [ ] Logging enabled
- [ ] Performance acceptable
- [ ] Documentation complete

---

## 🎯 Success Criteria

Your GPT is ready when:

✅ It can fetch athlete data from TrainingPeaks
✅ It correctly calculates or retrieves CTL/ATL/TSB
✅ It applies StressLogic to assess readiness
✅ It prescribes workouts with zones and fueling
✅ It communicates in Angela's coaching voice
✅ It handles errors gracefully
✅ It operates in both Coach and Athlete modes

---

## 🚦 Next Steps

After deployment:

1. **Test with real athletes** (start with 1-2)
2. **Gather feedback** on recommendations
3. **Iterate on logic** if needed
4. **Add advanced features**:
   - Historical analysis
   - Block transition automation
   - Race taper protocols
   - Team-wide analytics (coach mode)
5. **Integrate with dashboard** (UI)
6. **Deploy to production**

---

**Ready to deploy? Follow the steps above and you'll have a fully functional EchoDevo Coach GPT! 🎉**

---

**Last Updated:** January 9, 2026  
**Version:** 2.0  
**Status:** Ready for Implementation

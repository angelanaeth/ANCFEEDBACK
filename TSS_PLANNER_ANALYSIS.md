# TSS PLANNER - Complete Analysis & Implementation Plan

## 📋 WHAT IS TSS PLANNER?

The TSS Planner is an **AI-powered weekly training load recommendation system** that helps coaches decide whether to increase, hold, or decrease an athlete's training stress for the upcoming week.

### Core Purpose
- **Input**: Athlete's current training metrics (CTL, ATL, TSB), subjective feedback (soreness, sleep, mood), and execution data
- **Process**: Scoring algorithm that evaluates 5 categories to produce a total score
- **Output**: Recommended TSS for next week with rationale (increase 12%, hold steady, decrease 20%, etc.)

---

## 🎯 WHAT IT DOES

### 1. Weekly TSS Recommendations
For each sport (Run, Bike):
- Analyzes last week's performance
- Evaluates objective metrics (CTL, ATL, TSB, trends)
- Considers subjective feedback (soreness, sleep, HRV, mood, life stress)
- Produces recommendation: ⬆️ Increase, ⏸ Hold, or 🔻 Decrease
- Calculates specific TSS target range (e.g., 446-474 TSS)

### 2. Block-Specific Guidance
Different scoring rules for each training block:
- **BD (Base/Durability)**: Focus on CTL ramp (+4-7/week), injury prevention
- **BTH (Build/Threshold)**: Balance intensity with recovery
- **RR (Race Ready)**: Maintain sharpness, manage taper
- **SP (Speed/Power)**: Quality over quantity
- **VO2 (VO2 Max)**: High intensity, careful recovery monitoring

### 3. AI Narrative Generation
- Uses GPT to generate detailed explanations
- Shows rationale for recommendation
- Highlights risk factors and drivers
- Provides coach-friendly language

---

## 🧩 HOW IT WORKS - THE 5-CATEGORY SCORING SYSTEM

### Category 1: Training Load Metrics (Objective) - Score: -2 to +2
**ATL:CTL Ratio:**
- 0.80-0.95 → +2 (fresh, can increase)
- 0.95-1.00 → +1 (good balance)
- 1.00-1.05 → -1 (slightly fatigued)
- >1.05 → -2 (fatigued, reduce load)

**5-Day TSB Trend:**
- +1.0 to +2.5 → +2 (recovering well)
- 0 to +1.0 → +1 (stable)
- -1.0 → -1 (declining)
- < -1.5 → -2 (rapid fatigue accumulation)

**1-Day TSB:**
- > +10 → +2 (very fresh)
- +3 to +10 → +1 (fresh)
- -3 to +3 → 0 (neutral)
- < -3 → -1 (fatigued)

### Category 2: Workout Execution - Score: -2 to +2
- All key workouts at intended RPE/pace: +2
- All completed, some fade: 0
- ≥1 missed or cut short: -2

### Category 3: Subjective Recovery - Score: -2 to +1
Individual markers (each can be -1, -0.5, or 0):
- Soreness
- Mood/Irritability
- Sleep
- HRV / Resting HR
- Motivation

**Subjective total:**
- 0 to -1 → +1 (recovering well)
- -1.5 to -2.5 → -1 (some concerns)
- -3 or lower → -2 (multiple red flags)

### Category 4: Orthopedic/Joint Warnings - Score: -3 to 0
- No pain, no issues: 0
- Mild tightness/DOMS: -1
- New pain, niggles, limping: -3

### Category 5: Life Stress - Score: -2 to +1
- Minimal (calm, vacation): +1
- Normal (baseline): 0
- Moderate (work/family/travel): -1
- High (crisis): -2

---

## 📊 TSS ACTION TABLE (Based on Total Score)

| Total Score | Action               | TSS Multiplier       | Example (460 TSS last week) |
|-------------|----------------------|----------------------|-----------------------------|
| +6 to +9    | ⬆️ Increase a lot    | 1.12–1.20 × last week | 515-552 TSS                 |
| +3 to +5    | 🟢 Increase a little | 1.05–1.12 × last week | 483-515 TSS                 |
| -1 to +2    | ⏸ Hold steady        | 0.97–1.03 × last week | 446-474 TSS                 |
| -2 to -4    | 🔻 Decrease a little | 0.85–0.90 × last week | 391-414 TSS                 |
| -5 or lower | ⛔️ Decrease a lot    | 0.60–0.75 × last week | 276-345 TSS                 |

---

## 💾 DATA STRUCTURE

### Database Schema (from Echo-devo)

```sql
-- TSS Plan table (stores weekly recommendations)
CREATE TABLE tss_plan (
    id INTEGER PRIMARY KEY,
    athlete_id INTEGER NOT NULL,
    week_start DATE NOT NULL,
    discipline TEXT NOT NULL,  -- 'run' or 'ride'
    
    -- Block info
    block_type TEXT,  -- 'BD', 'BTH', 'RR', 'SP', 'VO2'
    
    -- Recommendations
    planned_tss TEXT,  -- e.g., "446-474"
    coach_notes TEXT,
    narrative TEXT,  -- AI-generated explanation
    
    -- Metrics
    lastweek_tss TEXT,
    atl TEXT,
    ctl TEXT,
    atl_ctl_ratio TEXT,
    tsb TEXT,
    tsb_trend TEXT,
    tsb_1d TEXT,
    
    -- Subjective scores
    execution TEXT,
    soreness TEXT,
    mood TEXT,
    sleep TEXT,
    hrv TEXT,
    motivation TEXT,
    life_stress TEXT,
    
    UNIQUE(athlete_id, week_start, discipline)
);
```

### JSON Storage Format
```json
{
  "athlete_id": {
    "2025-07-07": {
      "run": {
        "block_type": "BD",
        "planned_tss": "446-474",
        "coach_notes": "",
        "narrative": "<h3>AI/Modiq Narrative</h3>...",
        "lastweek_tss": "460",
        "atl": "78",
        "ctl": "71",
        "atl_ctl_ratio": "1.16",
        "tsb": "-7",
        "tsb_trend": "0",
        "tsb_1d": "0",
        "execution": "-1",
        "soreness": "-0.5",
        "mood": "0",
        "sleep": "0",
        "hrv": "-0.5",
        "motivation": "0",
        "life_stress": "1"
      },
      "ride": { ... }
    }
  }
}
```

---

## 🎨 UI COMPONENTS (from Echo-devo)

### 1. TSS Weekly Planner Button
- Main CTA button on coach dashboard
- Opens modal with planner interface
- Icon: table-list (fa-solid)

### 2. TSS Planner Modal
- **Header**: "TSS Weekly Planner" with athlete name
- **Week Selector**: Navigate between weeks
- **Sport Tabs**: Switch between Run and Bike
- **Input Section**:
  - Block type dropdown (BD, BTH, RR, SP, VO2)
  - Current metrics (CTL, ATL, TSB) - auto-filled from TrainingPeaks
  - Last week's TSS
  - Subjective feedback sliders/buttons
  - Life stress selector
- **Calculation Button**: "Generate TSS Recommendation"
- **Results Section**:
  - Total score display
  - Action category (emoji + text)
  - Recommended TSS range (large, prominent)
  - AI narrative with rationale
  - Save to athlete profile button

### 3. Markdown Narrative Templates
10 templates (5 blocks × 2 sports):
- TSS Planner - BD Run.md
- TSS Planner - BD Ride.md
- TSS Planner - BTH Run.md
- TSS Planner - BTH Ride.md
- TSS Planner - RR Run.md
- TSS Planner - RR Ride.md
- TSS Planner - SP Run.md
- TSS Planner - SP Ride.md
- TSS Planner - VO2 Run.md
- TSS Planner - VO2 Ride.md

---

## 🔧 IMPLEMENTATION OPTIONS

### Option 1: Clone Entire TSS Planner (Python Flask)
**Extract from Echo-devo:**
- Python scoring algorithm (`app.py` lines 831+)
- Flask routes (`/get_tss_plans_v3`, `/save_tss_plan`)
- HTML templates (`chat.html` TSS Planner modal)
- Markdown narratives (10 files)
- Database schema

**Pros:**
- Complete feature set
- Proven algorithm
- AI narrative generation works

**Cons:**
- Python backend (need to integrate with Hono/TypeScript)
- Complex Flask dependency
- Duplicate database schema

---

### Option 2: Rebuild in TypeScript/Hono (RECOMMENDED)
**What we'll build:**
1. **Scoring Engine** (TypeScript port of Python algorithm)
   - 5-category scoring system
   - Block-specific rules
   - TSS calculation formulas

2. **API Endpoints** (Hono)
   - `POST /api/tss-planner/calculate` - Run scoring algorithm
   - `POST /api/tss-planner/save` - Save plan to database
   - `GET /api/tss-planner/:athlete_id/:week` - Get saved plan
   - `GET /api/tss-planner/narratives/:block/:sport` - Get markdown template

3. **Database Schema** (D1)
   - `tss_plans` table matching Echo-devo structure
   - Migration file

4. **Frontend UI** (HTML/CSS/JS)
   - Modal interface
   - Week navigation
   - Sport tabs (Run/Bike)
   - Form inputs for subjective feedback
   - Results display with AI narrative

5. **Markdown Templates**
   - Copy 10 narrative templates
   - Store in `/public/narratives/tss_planner/`

**Pros:**
- Native TypeScript/Hono integration ✅
- Consistent with current architecture ✅
- No Python dependency ✅
- Can use existing TrainingPeaks integration ✅
- Can leverage GPT for AI narratives ✅

**Cons:**
- Need to port Python algorithm (2-3 hours work)
- Need to rebuild UI (2-3 hours work)

---

### Option 3: Hybrid Approach
**Keep Python for complex logic, wrap with Hono:**
- Run Python TSS scoring as subprocess
- Hono endpoints call Python scripts
- Return results to TypeScript frontend

**Pros:**
- Less porting work
- Keep proven algorithm

**Cons:**
- Python runtime dependency in production
- Cloudflare Workers doesn't support Python
- More complex deployment

---

## ✅ RECOMMENDATION: Option 2 (Rebuild in TypeScript/Hono)

### Why This Is Best
1. **Cloudflare Compatible**: No Python runtime needed
2. **Unified Stack**: Everything in TypeScript/Hono
3. **Clean Architecture**: Fits existing pattern
4. **Maintainable**: One codebase, one language
5. **Fast**: Native TypeScript performance

### What We'll Build (Step by Step)

#### Phase 1: Backend (2-3 hours)
1. Port scoring algorithm to TypeScript
2. Create TSS calculation functions
3. Build API endpoints
4. Create D1 database migration
5. Test with sample data

#### Phase 2: Frontend (2-3 hours)
1. Copy markdown narratives
2. Create TSS Planner modal UI
3. Build form inputs
4. Add week navigation
5. Implement sport tabs
6. Style results display

#### Phase 3: Integration (1 hour)
1. Fetch athlete metrics from TrainingPeaks
2. Generate AI narratives with GPT
3. Save plans to database
4. Display in athlete profile

**Total Estimated Time: 5-7 hours**

---

## 📦 FILES TO EXTRACT FROM ECHO-DEVO

### Must Have:
1. **Scoring Algorithm**: 
   - `/EchoAdvisor/app.py` (lines 831-1200) - Core TSS scoring logic
   
2. **Markdown Narratives**:
   - All 10 files from `/EchoAdvisor/narratives/tss_planner/`
   
3. **Database Schema**:
   - Migration files for `tss_plan` table structure

### Reference (Don't Copy):
1. **UI Templates**: 
   - `/EchoAdvisor/templates/chat.html` (TSS Planner modal section)
   - Use as reference for rebuilding in our UI

2. **JSON Data**:
   - `/EchoAdvisor/tss_plans.json` - Example data structure

---

## 🚀 NEXT STEPS

### What I Need From You:

**1. Confirm Approach:**
- ✅ Option 2: Rebuild in TypeScript/Hono (RECOMMENDED)
- ❌ Option 1: Try to integrate Python Flask
- ❌ Option 3: Hybrid Python subprocess approach

**2. Clarify Scope:**
- Do you want TSS Planner for BOTH Run and Bike? ✅ or just one?
- Do you want all 5 block types (BD, BTH, RR, SP, VO2)? ✅ or just some?
- Do you want AI narrative generation? ✅ or just the TSS calculation?

**3. Timeline:**
- Do you want me to build this NOW? (5-7 hours)
- Or document for later implementation?

---

## 💡 MY RECOMMENDATION

**BUILD IT NOW** using Option 2 (TypeScript/Hono rebuild).

**Why:**
1. Your current stack is Hono/TypeScript - keep it consistent ✅
2. Cloudflare Workers deployment is clean with no Python ✅
3. The algorithm is straightforward to port (mostly math) ✅
4. We can reuse TrainingPeaks data we're already fetching ✅
5. GPT integration for narratives is easy (we already have it) ✅

**What You'll Get:**
- Clean TSS Planner button on coach dashboard
- Modal with full scoring interface
- Automatic TSS recommendations based on 5-category scoring
- AI-generated rationales
- Saved plans in database
- Visible in athlete profiles

**Ready to proceed?** Say "BUILD IT" and I'll start! 🚀

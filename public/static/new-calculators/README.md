# EchoDevo Training Calculators

A comprehensive single-page coaching calculator app for bike, run, and swim performance analysis. All calculators run client-side with no backend required.

---

## Entry Point

- **Main page**: `index.html`
- **VO₂ Prescriber logic**: `vo2-script.js` (loaded by index.html)
- **TH Bike Analysis logic**: `th-script.js` (loaded by index.html)

---

## Completed Features

### Navigation & Structure
- 15-tab navigation (Table of Contents, 12 calculators + 1 analysis tool)
- Responsive tab layout with active-state highlighting
- Table of Contents with direct jump links

### Calculators

| Tab | Calculator | Notes |
|-----|-----------|-------|
| Critical Power | 3-Point & 2-Point CP (Bike/Run) | Least-squares fit; outputs zones, W', VO₂ Max Power |
| Best Effort Wattage | Interval peak power table + sustain duration | Uses CP + W' |
| Critical Speed (Run) | 3-Point & 2-Point CS Run | Outputs pace zones |
| Best Effort Pace | Run pace intervals | Uses CS + D' |
| Critical Speed (Swim) | 3-Point & 2-Point CSS | Outputs swim pace zones |
| Swim Interval Pacing | Per-100 pacing by distance | |
| Low Cadence | Power vs cadence chart | |
| CHO Burn (Swim) | Carbohydrate burn estimate | By distance, pace, effort |
| CHO Burn (Bike) | kJ → CHO conversion | Two-step: work output then nutrition |
| CHO Burn (Run) | Carbohydrate burn estimate | By weight + time |
| Training Zones | Live dual-input (CP or Z1-top) | Bike power, run power, run pace, swim, HR |
| Heat & Humidity Adj. | Performance degradation lookup | Wattage, pace, heart rate adjustment |
| VO₂ Max Interval Prescriber | Bike (CP/W'/pVO₂max) + Run (CS/vVO₂max/D') | Full workout prescription with TSS, structure, progression |
| TH Bike Analysis | LT1 / OGC threshold report from .FIT file | Full pipeline: FIT parsing → stage detection → D-max/Conconi/slope-inflection analysis → zone prescription → Chart.js charts → AI coaching → PDF export |

### TH Bike Analysis (new)
- Upload `.fit` file via drag-and-drop or file picker
- Automatic workout classification (protocol vs intervals vs steady-state)
- Stage detection with smoothed power segmentation
- Three-method threshold detection: D-max, Conconi deflection, slope inflection
- LT1 and OGC detection with consensus voting
- Confidence scores (0–100%) with guidance text
- Training zone prescription (ZR, Z1, Z2, Z3, CP+) with HR from linear regression
- Block periodization table (7 block types: Base, Build/TH, TTE, Aerobic Expansion, VO₂ Max, Specificity, Rebuild)
- Chart.js HR response curve + Δ/W slope bar chart
- Stage breakdown table with zone badges, drift, and slope tags
- AI coaching interpretation via Claude API (requires internet, uses proxy)
- PDF export (light/dark toggle) via jsPDF — branded "EchoDevo"

---

## Branding

- All "Angela Naeth Coaching" references replaced with **EchoDevo**
- All "QT2 Systems" / "QT2.0" / "AngelaNaethCoaching" references removed from user-visible output
- PDF header/footer: "EchoDevo · LT1/OGC Threshold Analysis Report"
- PDF filenames: `EchoDevo_Threshold_<name>_<date>.pdf`
- CSS class names retain `qt2-*` prefix (internal implementation, not visible to users)

---

## Data Models

### TH Bike Analysis (`th-script.js`)

**Stage object**
```js
{
  power: Number,       // avg watts
  pctCP: Number,       // % of Critical Power
  stableHR: Number,    // stable HR (last 40% of stage)
  drift: Number,       // HR drift early→late (bpm)
  dur: Number,         // stage duration (seconds)
  dpw: Number|null,    // HR delta / watt slope
  dhr: Number|null,    // HR delta from prev stage
  pctHRR: Number,      // % heart rate reserve
  zone: String,        // 'base' | 'lt1' | 'buffer' | 'ogc' | 'near'
  _dmaxDist: Number    // D-max perpendicular distance (optional)
}
```

**Analysis result (`_analysis`)**
```js
{
  lt1: Stage, ogc: Stage, lt1i: Number, ogci: Number,
  mean: Number, adi: Number,          // aerobic window (W)
  lt1c: 'high'|'moderate'|'low',
  ogcc: 'high'|'moderate'|'low',
  lt1Score: Number, ogcScore: Number,  // 38 | 62 | 85
  flags: Array, stages: Array,
  cp: Number, hrRest: Number, hrMax: Number,
  hrmaxEstimated: Boolean,
  methods: { dMax: Number, conconi: Number, inflection: Number }
}
```

### Storage
- No server-side storage; all state is in-memory JS variables
- RESTful Table API not used by this app (pure client-side calculations)

---

## External Dependencies (CDN)

| Library | Version | Use |
|---------|---------|-----|
| Chart.js | 4.4.1 | HR response + Δ/W charts in TH Bike Analysis |
| jsPDF | 2.5.1 | PDF export in TH Bike Analysis |

---

## File Structure

```
index.html           — Main app (HTML, CSS, core JS calculators)
vo2-script.js        — VO₂ Prescriber (Bike + Run) logic
th-script.js         — TH Bike Analysis logic (FIT parser, analysis, rendering, PDF)
threshold-report-source.html  — Source reference (not served to users)
vo2-run-prescriber-angela.html  — Source reference (not served)
vo2-prescriber-shopify-angela.html  — Source reference (not served)
```

---

## Features Not Yet Implemented

- Swim threshold analysis (.FIT upload for swim)
- Run threshold analysis (pace + HR from .FIT)
- Athlete profile persistence (save/load inputs)
- Multiple athlete management
- Historical test comparison

## Recommended Next Steps

1. Add "Save inputs" localStorage persistence per calculator
2. Add a "My Athletes" section backed by the RESTful Table API
3. Extend TH Bike Analysis to allow manual stage entry (no .FIT required)
4. Add print CSS for clean browser-print output
5. Add unit toggle (metric/imperial) for weight and distance fields

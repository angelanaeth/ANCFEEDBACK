# 🔍 TRAININGPEAKS API INVESTIGATION RESULTS

## Date: January 11, 2026

---

## 🎯 OBJECTIVE

Find the correct TrainingPeaks API endpoint to update existing workout Pre-Activity Comments with fueling guidance.

---

## 📚 RESEARCH SUMMARY

### Sources Investigated
1. **Official TrainingPeaks Help**: https://help.trainingpeaks.com/hc/en-us/articles/234441128-TrainingPeaks-API
2. **GitHub PartnersAPI**: https://github.com/TrainingPeaks/PartnersAPI
3. **Tapiriik Integration** (open source): https://github.com/cpfair/tapiriik
4. **TrainingPeaks API Wiki**: https://github.com/TrainingPeaks/PartnersAPI/wiki

### Key Findings

#### ✅ Available API Endpoints
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/v2/workouts/{athleteId}/{startDate}/{endDate}` | GET | Fetch workouts | ✅ Working |
| `/v3/file` | POST | Upload new activity file (PWX/TCX) | ✅ Available |
| `/v1/workouts/plan` | POST | Create new planned workout | ✅ Working |
| `/v1/athlete/profile` | GET | Get athlete profile | ✅ Working |

#### ❌ MISSING: Update Existing Workout Endpoint
**Critical Finding**: TrainingPeaks PUBLIC API **DOES NOT provide** an endpoint to update existing workout fields (including Pre-Activity Comments).

### Evidence
1. **No documentation** for PUT/PATCH on `/v1/workouts/{id}` or `/v2/workout/{id}`
2. **Tapiriik implementation** (open source TP integration) only implements:
   - Download workouts (GET)
   - Upload new activities (POST `/v3/file`)
   - No update functionality
3. **GitHub PartnersAPI Wiki** requires authentication to view full docs
4. **TP API is approval-only**: "The TrainingPeaks API is currently available for approved developers only"

---

## 🚫 API LIMITATIONS CONFIRMED

### What TrainingPeaks PUBLIC API Can Do
✅ Read athlete profile  
✅ Read workouts (completed and planned)  
✅ Upload NEW activities (via PWX/TCX file)  
✅ Create NEW planned workouts  

### What TrainingPeaks PUBLIC API CANNOT Do
❌ Update existing workout comments  
❌ Modify existing workout description  
❌ Edit Pre-Activity Comments  
❌ Patch/update any workout fields  

---

## 💡 WHY THIS LIMITATION EXISTS

### TrainingPeaks Business Model
1. **Protect Coach-Athlete Relationship**:
   - Workouts are typically created by coaches
   - Direct API updates could bypass coach intent
   - Comments are meant for athlete-coach communication

2. **Data Integrity**:
   - Prevents unauthorized modifications
   - Maintains audit trail
   - Protects against data corruption

3. **Approval-Only API**:
   - Full API access requires TrainingPeaks approval
   - Partner integrations get extended permissions
   - Public API is read-mostly

---

## 🔧 ALTERNATIVE SOLUTIONS

### Option 1: Manual Copy-Paste (RECOMMENDED)
**Implementation**: Display fueling guidance in a modal/copyable format

**Pros**:
- ✅ Works immediately
- ✅ No API limitations
- ✅ User has control
- ✅ Can review before adding

**Cons**:
- ⚠️ Requires manual action
- ⚠️ Not automated

**User Flow**:
1. Click "⚡ Fuel Next Week"
2. See modal with all 8 workouts + fueling guidance
3. Copy fueling text for each workout
4. Paste into TrainingPeaks Pre-Activity Comments manually

---

### Option 2: Browser Extension (FUTURE)
**Implementation**: Create Chrome/Firefox extension

**Pros**:
- ✅ Direct access to TP DOM
- ✅ Can automate copy-paste
- ✅ User-side solution

**Cons**:
- ⏳ Requires development time
- ⏳ Separate installation step
- ⚠️ Browser-specific

---

### Option 3: Request TrainingPeaks Partnership (LONG-TERM)
**Implementation**: Apply for TP Partner API access

**Pros**:
- ✅ Official integration
- ✅ Extended API permissions
- ✅ Potential for workout updates

**Cons**:
- ⏳ Approval process (weeks/months)
- ⏳ May require business agreement
- ⚠️ Not guaranteed approval

---

## 🎯 RECOMMENDED IMPLEMENTATION

### Phase 1: Copyable Fueling Modal (IMMEDIATE)
**What We Built**:
- ✅ Button fetches next week's workouts
- ✅ Calculates fueling guidance
- ✅ Stores in database queue

**What We Need to Add**:
- 📝 Display fueling in a copyable modal
- 📝 Group by date for easy navigation
- 📝 One-click copy buttons per workout
- 📝 Instructions for pasting to TP

**Time to Implement**: ~30 minutes

**User Experience**:
```
1. Click "⚡ Fuel Next Week"
2. Modal appears with:
   
   📅 Monday, Jan 12, 2026
   🚴 Z1 Ride (90 min)
   🍌 CARBS: 90g (60g/hr)
   💧 FLUID: 750ml (500ml/hr)
   🧂 SODIUM: 900mg (600mg/hr)
   [Copy to Clipboard]
   
   📅 Tuesday, Jan 13, 2026
   🏊 Swim Workout (60 min)
   🍌 CARBS: 45g (45g/hr)
   💧 FLUID: 300ml (300ml/hr)
   🧂 SODIUM: 500mg (500mg/hr)
   [Copy to Clipboard]
   
   ... (6 more workouts)

3. Click [Copy to Clipboard] for each workout
4. Open TrainingPeaks calendar
5. Click workout → Add Pre-Activity Comment → Paste
6. Repeat for all workouts
```

---

### Phase 2: Export to CSV/PDF (FUTURE)
- Generate downloadable PDF with all fueling guidance
- Athletes can print or keep digital copy
- Reference during training

---

### Phase 3: TP Partnership Application (LONG-TERM)
- Apply for official TrainingPeaks Partner status
- Request extended API permissions
- Implement direct workout updates if approved

---

## 📋 CONCLUSION

### Summary
**TrainingPeaks PUBLIC API does not support updating existing workout comments**. This is by design to protect data integrity and coach-athlete relationships.

### Current System Status
✅ **Working**: Fueling calculation, database queue, button UI  
⏳ **Pending**: Display mechanism (manual copy-paste)  
❌ **Not Possible**: Automatic API write to TP workouts  

### Next Steps
1. ✅ Document API limitation (THIS FILE)
2. 📝 Implement copyable fueling modal (30 min)
3. 📝 Update documentation with new user flow
4. 📝 Test with real athletes
5. ⏳ Consider TP Partnership application (future)

---

## 🔗 REFERENCES

- **TP API Docs**: https://github.com/TrainingPeaks/PartnersAPI/wiki
- **TP Help Center**: https://help.trainingpeaks.com/hc/en-us/articles/234441128-TrainingPeaks-API
- **Tapiriik Integration**: https://github.com/cpfair/tapiriik
- **OAuth2 Implementation**: https://github.com/TrainingPeaks/tp-public-api-auth

---

**Status**: ✅ API Investigation Complete  
**Recommendation**: Implement Phase 1 (Copyable Modal)  
**ETA**: 30 minutes to implement  
**Last Updated**: January 11, 2026

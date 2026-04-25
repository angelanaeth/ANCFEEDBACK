# 🎨 SWIM WORKOUT FORMAT FIX - KEEP DASHES

**Date**: 2026-04-14  
**Issue**: Workouts showing bullets (•) instead of dashes (-)  
**Status**: ✅ **FIXED AND DEPLOYED**  
**Latest Deployment**: https://238ad8fe.angela-coach.pages.dev  

---

## ❌ **THE PROBLEM**

### **What You Saw in TrainingPeaks** (WRONG)
```
Warm Up
300 as:
• 100 Swim @50-70%
• 5 x 25 Kick
• Take 5s
• 100 Pull @70%
```

### **What You Wanted** (YOUR EXAMPLES)
```
Warm Up
700 as:
- 200 @50-70%
- 200 Pull @70%, focus on a strong rotation
- 4x50 Swim @80-90% - Take 10s
- 4x25 FAST - Take 10s
```

**The Issue**:
- Code was converting ALL dashes `-` to bullets `•`
- This didn't match your preferred format
- Preview also showed bullets instead of dashes

---

## ✅ **THE FIX**

### **What Changed**

**Backend (`src/index.tsx`):**
```typescript
// BEFORE (converting dashes to bullets):
formatted = formatted.replace(/(^|<br>)(\s*)-\s+/g, '$1$2• ');

// AFTER (keeping dashes):
// Simply convert line breaks to <br> tags - keep dashes as-is
let formatted = description.replace(/\n/g, '<br>');
```

**Frontend (`swim-planner.html`):**
```javascript
// BEFORE (converting dashes to bullets):
formatted = formatted.replace(/(^|<br>)(\s*)-\s+/g, '$1$2• ');

// AFTER (keeping dashes):
// Simply convert line breaks to <br> tags - keep dashes as-is
let formatted = description.replace(/\n/g, '<br>');
```

### **Formatting Rules Now**
✅ **Line breaks**: `\n` → `<br>` (preserved)  
✅ **Dashes**: `-` → `-` (kept as-is, NOT converted to bullets)  
✅ **Headers**: `Warm Up:` → `<strong>Warm Up:</strong>` (bold)  
❌ **NO bullet conversion**

---

## 🎯 **EXPECTED RESULTS NOW**

### **In Preview (Normal Format)**
```
Warm Up
400 as:
- 200 Swim @50-70%
- 4x25 Kick - Take 5s
- 100 Pull @70%

Drill Set - Take 5-10s after each 25
Six Times Through...
- 25 Press Your Buoy Drill
- 25 Swim

Pre-Set
8x50 Swim @80-90% - Take 10s

Main Set
4x600 as follows, w/ 20s in between each:
- #1 @80%
- #2 @70%
- #3 @80-90%
- #4 @80-90%

Cool Down
4x25 Press Your Buoy Drill
2x50 Swim - focused on PYB and a neutral head - Take 5-10s between each
```

### **In Preview (TrainingPeaks Format)**
```html
<strong>Warm Up</strong><br>
400 as:<br>
- 200 Swim @50-70%<br>
- 4x25 Kick - Take 5s<br>
- 100 Pull @70%<br>
<br>
<strong>Drill Set</strong> - Take 5-10s after each 25<br>
Six Times Through...<br>
- 25 Press Your Buoy Drill<br>
- 25 Swim<br>
<br>
<strong>Pre-Set</strong><br>
8x50 Swim @80-90% - Take 10s<br>
<br>
<strong>Main Set</strong><br>
4x600 as follows, w/ 20s in between each:<br>
- #1 @80%<br>
- #2 @70%<br>
- #3 @80-90%<br>
- #4 @80-90%<br>
<br>
<strong>Cool Down</strong><br>
4x25 Press Your Buoy Drill<br>
2x50 Swim - focused on PYB and a neutral head - Take 5-10s between each
```

### **In TrainingPeaks (After Push)**
```
Warm Up
400 as:
- 200 Swim @50-70%
- 4x25 Kick - Take 5s
- 100 Pull @70%

Drill Set - Take 5-10s after each 25
Six Times Through...
- 25 Press Your Buoy Drill
- 25 Swim

Pre-Set
8x50 Swim @80-90% - Take 10s

Main Set
4x600 as follows, w/ 20s in between each:
- #1 @80%
- #2 @70%
- #3 @80-90%
- #4 @80-90%

Cool Down
4x25 Press Your Buoy Drill
2x50 Swim - focused on PYB and a neutral head - Take 5-10s between each
```

✅ **All three formats now match!**

---

## 🧪 **TEST IT NOW**

### **Step 1: Open Swim Planner**
```
https://angela-coach.pages.dev/static/swim-planner?athlete=427194
```

### **Step 2: Select Any Workout**
- Choose any workout from the library
- Example: "Triathlon Swim Series - Endurance Build #1"

### **Step 3: Check Preview (Normal Format)**
- Look at the "Workout Preview" panel on the right
- ✅ Should show dashes `-` (not bullets `•`)
- ✅ Headers should be styled (blue, bold-ish)
- ✅ Line breaks preserved

### **Step 4: Check Preview (TrainingPeaks Format)**
- Click "Show TrainingPeaks Format" button
- ✅ Should show HTML: `<br>` tags
- ✅ Dashes still shown as `-` (not `•`)
- ✅ Headers wrapped in `<strong>...</strong>`

### **Step 5: Push to TrainingPeaks**
- Add workout to calendar (click any day)
- Click "Push to TrainingPeaks" button
- Wait for success message

### **Step 6: Verify in TrainingPeaks**
- Open TrainingPeaks
- Find the workout on your calendar
- Open the workout details
- ✅ Check: Dashes shown as `-` (NOT `•`)
- ✅ Check: Headers are bold
- ✅ Check: Line breaks preserved
- ✅ Check: Matches your example format exactly

---

## ✅ **SUCCESS CRITERIA**

**The fix is successful if:**

1. ✅ Preview shows dashes `-` (not bullets `•`)
2. ✅ TrainingPeaks format preview shows dashes as `-`
3. ✅ Push to TrainingPeaks succeeds
4. ✅ **Dashes remain as dashes in TrainingPeaks** (MOST IMPORTANT!)
5. ✅ Format matches your examples exactly
6. ✅ Headers are bold
7. ✅ Line breaks preserved

---

## 📊 **COMPARISON**

| Element | Before | After |
|---------|--------|-------|
| **Dashes** | • (bullets) | - (dashes) ✅ |
| **Line breaks** | ✅ Preserved | ✅ Preserved |
| **Headers** | ✅ Bold | ✅ Bold |
| **Format consistency** | ❌ Different | ✅ Same everywhere |

---

## 🔧 **TECHNICAL DETAILS**

### **Files Modified**
1. `src/index.tsx` (line ~8876-8889)
   - Removed dash-to-bullet regex: `formatted.replace(/(^|<br>)(\s*)-\s+/g, '$1$2• ')`
   - Now: Only `\n` → `<br>` and header bold conversion

2. `public/static/swim-planner.html` (line ~152133-152146)
   - Removed dash-to-bullet regex: `formatted.replace(/(^|<br>)(\s*)-\s+/g, '$1$2• ')`
   - Now: Only `\n` → `<br>` and header bold conversion

### **Build Output**
```
vite v6.4.1 building SSR bundle for production...
✓ 43 modules transformed.
✅ Custom _routes.json written
dist/_worker.js  248.22 kB
✓ built in 1.31s
```

### **Deployment**
```
✨ Success! Uploaded 1 files (66 already uploaded) (4.58 sec)
✨ Deployment complete!
URL: https://238ad8fe.angela-coach.pages.dev
```

---

## 📝 **COMMIT DETAILS**

**Commit**: 481fcbb  
**Message**: "🎨 FIX: Keep dashes in swim workouts (don't convert to bullets)"  
**Branch**: main  
**Files Changed**: 2 files (+4, -8 lines)  
**GitHub**: https://github.com/angelanaeth/Block-Race-Planner/commit/481fcbb

---

## 🎉 **FIX DEPLOYED!**

The swim workout formatting now keeps dashes as dashes (NOT bullets). Both the preview and TrainingPeaks display should match your example format exactly.

**Test URL**: https://angela-coach.pages.dev/static/swim-planner?athlete=427194

Please test and confirm:
1. ✅ Preview shows dashes
2. ✅ TrainingPeaks shows dashes after push
3. ✅ Format matches your examples

---

**Status**: ✅ **FIXED AND DEPLOYED**  
**Last Updated**: 2026-04-14  
**Deployment**: https://238ad8fe.angela-coach.pages.dev

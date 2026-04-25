# 📝 COACH NOTES - LOCATION & USAGE GUIDE

## ✅ **YOUR REQUEST:**
> "Where do the coach notes get saved? They should save on the athletes profile page and can be added too."

---

## ✅ **ANSWER: Notes ARE Already on the Athlete Profile Page!**

### **📍 LOCATION:**

The Coach Notes section appears **on each athlete's profile page**, right after you select an athlete from the dropdown.

---

## 🎯 **HOW TO ACCESS COACH NOTES:**

### **Step 1: Open Dashboard**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach.html
```

### **Step 2: Select Athlete**
```
→ Use the searchable athlete dropdown at the top
→ Type athlete name or ID to search
→ Click on an athlete
```

### **Step 3: Scroll to Coach Notes**
```
→ After selecting athlete, you'll see the full athlete dashboard
→ Scroll down past the search/filter boxes
→ You'll see: "📝 Coach Notes" card
```

---

## 🖼️ **WHAT IT LOOKS LIKE:**

```
┌─────────────────────────────────────────────────┐
│  📝 Coach Notes      Last updated: 1/12/26 5:41 │
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐  │
│  │ Add notes about this athlete...          │  │
│  │ (auto-saved)                             │  │
│  │                                          │  │
│  │ [Your notes here...]                     │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  [💾 Save Notes]  ✓ Saved                       │
└─────────────────────────────────────────────────┘
```

---

## 💾 **HOW NOTES ARE SAVED:**

### **Database Table: `athlete_notes`**
```sql
CREATE TABLE athlete_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  athlete_id TEXT NOT NULL,
  coach_id INTEGER,
  notes TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(athlete_id, coach_id)
);
```

### **Key Features:**
- ✅ **Per-athlete**: Each athlete has their own notes
- ✅ **Per-coach**: Each coach has separate notes for same athlete
- ✅ **Auto-save**: Notes saved when you type (on change)
- ✅ **Manual save**: Save button for explicit saving
- ✅ **Timestamp**: Shows when last updated
- ✅ **Persistent**: Saved to database, not session storage

---

## 📊 **CURRENT NOTES IN DATABASE:**

```
Athlete 427194:
  Coach 29: "TESTING."
  Coach 28: "This is a test."
  Coach 25: "Test athlete note - working well with current training plan!"
```

**Each coach sees ONLY their own notes!** ✅

---

## 🎨 **HOW TO USE:**

### **Adding Notes:**
```
1. Select athlete from dropdown
2. Scroll to "Coach Notes" section
3. Type in the text area
4. Notes auto-save on change
   OR
   Click "Save Notes" button
5. See "✓ Saved" confirmation
```

### **Editing Notes:**
```
1. Select same athlete again
2. Notes automatically load
3. Edit the text
4. Save (auto or manual)
5. Timestamp updates
```

### **Viewing Notes:**
```
→ Notes load automatically when you select athlete
→ Shows timestamp of last update
→ Always shows YOUR notes (coach-specific)
```

---

## 🔌 **API ENDPOINTS:**

### **GET Notes**
```bash
curl http://localhost:3000/api/coach/athlete/427194/notes

Response:
{
  "athlete_id": "427194",
  "notes": "Test athlete note - working well...",
  "updated_at": "2026-01-11T19:50:25.000Z"
}
```

### **POST/Save Notes**
```bash
curl -X POST http://localhost:3000/api/coach/athlete/427194/notes \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated training notes..."}'

Response:
{
  "success": true,
  "athlete_id": "427194",
  "notes": "Updated training notes...",
  "updated_at": "2026-01-12T05:41:37.000Z"
}
```

---

## 🔍 **VERIFICATION:**

### **Test Notes Are Working:**

1. **Open dashboard** in browser
2. **Select athlete** 427194
3. **Scroll down** to Coach Notes section
4. **Type something** in the text area
5. **Click Save Notes**
6. **See "✓ Saved"** confirmation
7. **Refresh page** → Notes should persist
8. **Select different athlete** → Different notes
9. **Select 427194 again** → Your notes are back!

---

## ✅ **FEATURES:**

### **Coach Isolation**
- ✅ Each coach has separate notes per athlete
- ✅ Coach A can't see Coach B's notes
- ✅ Based on coach account in database

### **Auto-Save**
- ✅ Saves when you blur/change text
- ✅ Manual save button available
- ✅ Shows save status

### **Timestamps**
- ✅ Shows last updated date/time
- ✅ Updates when you save
- ✅ Displayed in header

### **Persistence**
- ✅ Saved to SQLite database
- ✅ Survives page refresh
- ✅ Survives service restart

---

## 📋 **COMMON QUESTIONS:**

### **Q: Can I add multiple notes?**
**A:** The text area supports unlimited text. You can write as much as you want and it all saves as one note.

### **Q: Are notes shared with other coaches?**
**A:** No, each coach sees only their own notes. Notes are isolated by coach_id.

### **Q: Can the athlete see these notes?**
**A:** No, these are coach-only notes. Athletes don't have access to the coach dashboard.

### **Q: Can I see notes history?**
**A:** Currently shows only current notes and last updated timestamp. History tracking can be added if needed.

### **Q: What if I switch athletes?**
**A:** Notes auto-save before switching. When you come back to the athlete, notes load automatically.

---

## 🛠️ **TECHNICAL DETAILS:**

### **Code Locations:**
- **UI**: `/home/user/webapp/public/static/coach.html` lines 438-461
- **Load Function**: `loadAthleteNotes()` line 1874
- **Save Function**: `saveAthleteNotes()` line 1896
- **API Endpoints**: `/home/user/webapp/src/index.tsx` lines 1333-1418

### **Database:**
- **Table**: `athlete_notes`
- **Migration**: `/home/user/webapp/migrations/0002_athlete_notes.sql`
- **Unique Key**: (athlete_id, coach_id)

---

## 📸 **WHERE TO FIND IT:**

### **Visual Flow:**

```
1. Open Dashboard
   ↓
2. Select Athlete (dropdown)
   ↓
3. Athlete Dashboard Loads
   ↓
   ┌─────────────────────────────┐
   │ Athlete Search/Filter       │
   └─────────────────────────────┘
   ↓
   ┌─────────────────────────────┐
   │ 📝 Coach Notes ← HERE!      │  ← SCROLL DOWN TO SEE THIS
   │  [Text area]                │
   │  [Save button]              │
   └─────────────────────────────┘
   ↓
   ┌─────────────────────────────┐
   │ 📅 Today's Fitness          │
   └─────────────────────────────┘
   ↓
   More sections...
```

---

## ✅ **CONFIRMATION:**

**Coach notes ARE on the athlete profile page!**

- ✅ Location: Right after athlete selection, before fitness data
- ✅ Saving: Works via API to database
- ✅ Loading: Auto-loads when athlete selected
- ✅ Persistent: Saved in SQLite `athlete_notes` table
- ✅ Isolated: Each coach has separate notes
- ✅ Tested: Notes currently in database for athlete 427194

**Everything is working as requested!** 🎉

---

**Last Updated**: 2026-01-12  
**Status**: ✅ IMPLEMENTED AND WORKING  
**Location**: Athlete Profile Page → Coach Notes Section  
**Database**: athlete_notes table with coach isolation

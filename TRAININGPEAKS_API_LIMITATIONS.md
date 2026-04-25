# TrainingPeaks API Limitations

## What We Discovered

After extensive testing, we've confirmed that the TrainingPeaks API **does NOT allow coaches to programmatically update or create planned workouts for athletes**.

### Failed Attempts

1. **PUT /v2/workouts/id/{id}** → `405 Method Not Allowed`
2. **PATCH /v2/workouts/id/{id}** → `405 Method Not Allowed`
3. **POST /v1/workouts/{id}** → `404 Not Found`
4. **POST /v1/workouts** → `404 Not Found`
5. **POST /v1/workouts/plan** → `404 Not Found` (even with coach token + `workouts:plan` scope)

### What Coaches CAN Do

✅ Read athlete data (`coach:athletes` scope)
✅ View athlete workouts (`workouts:read`, `workouts:details` scopes)
✅ Attach/detach athletes (`coach:attach-athletes`, `coach:detach-athletes` scopes)
✅ Search athletes (`coach:search-athletes` scope)

### What Coaches CANNOT Do

❌ Create planned workouts for athletes
❌ Update existing planned workouts
❌ Modify workout descriptions or notes
❌ Add Pre-Activity Comments programmatically

## The Solution

Since we can't write back to TrainingPeaks, we'll provide fueling guidance through our dashboard with these features:

### 1. **Dashboard Display**
- Show calculated fueling for each workout
- Display CHO, hydration, and sodium per workout
- Clear, easy-to-read format

### 2. **Copy-Paste Feature**
- One-click copy fueling text for each workout
- Formatted text ready to paste into TrainingPeaks Pre-Activity Comments
- Mobile-friendly

### 3. **Bulk Export**
- Export all week's fueling to CSV
- Print-friendly format
- Email option (future)

### 4. **Manual Workflow**
1. Coach opens dashboard
2. Clicks "Fuel Next Week"
3. Reviews calculated fueling
4. Copies fueling text for each workout
5. Pastes into TrainingPeaks Pre-Activity Comments manually

## Why This Works Better

1. **No API limitations** - We control the display
2. **More flexible** - Coach can edit before adding
3. **More reliable** - No failed API writes
4. **Better UX** - Coach can see all fueling at once
5. **Mobile-friendly** - Works on phone/tablet

## Implementation Status

- [x] Fueling calculations working
- [x] Profile-based CHO values
- [x] Current week detection (Mon-Sun)
- [x] Queue system (no longer needed, but kept for future)
- [ ] Copy-paste UI feature
- [ ] Bulk export feature
- [ ] Print-friendly view

## Next Steps

1. ✅ Remove failed writeback attempts from queue
2. ✅ Update UI to show fueling per workout
3. ✅ Add "Copy" button for each workout
4. ✅ Add bulk export (CSV)
5. ⏳ Test with Angela's real workflow


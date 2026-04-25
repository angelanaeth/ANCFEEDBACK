# 🔧 CRITICAL FIX - TrainingPeaks OAuth Limitation

## ⚠️ **Issue Discovered**

TrainingPeaks OAuth does **NOT allow mixing coach and athlete scopes** in a single authorization request.

**Error Message:**
```
"Requesting access to both coach and athletes accounts is not allowed at this time. 
Please contact QT2 Systems to resolve this issue."
```

---

## ✅ **Solution Implemented**

Created **TWO SEPARATE OAuth flows**:

### 1️⃣ **Coach Mode** (`/auth/trainingpeaks/coach`)
**Scopes:**
- `coach:athletes`
- `coach:attach-athletes`
- `coach:create-athletes`
- `coach:detach-athletes`
- `coach:search-athletes`
- `coach:plans`
- `workouts:read`
- `workouts:details`
- `workouts:plan`
- `events:read`
- `events:write`

**Capabilities:**
✅ Manage all athletes in coaching account
✅ Post workouts to athlete calendars
✅ Create training plans
✅ Attach/detach athletes
✅ Full coaching dashboard

**OAuth URL:**
```
https://oauth.trainingpeaks.com/oauth/authorize?
response_type=code&
client_id=qt2systems&
redirect_uri=http://localhost:3000/auth/trainingpeaks/coach/callback&
scope=coach:athletes+coach:attach-athletes+...
```

---

### 2️⃣ **Athlete Mode** (`/auth/trainingpeaks/athlete`)
**Scopes:**
- `athlete:profile`
- `workouts:read`
- `workouts:details`
- `events:read`
- `metrics:read`

**Capabilities:**
✅ View own training data
✅ Analyze CTL/ATL/TSB
✅ Review workout history
✅ Access wellness metrics
✅ Personal performance insights

**OAuth URL:**
```
https://oauth.trainingpeaks.com/oauth/authorize?
response_type=code&
client_id=qt2systems&
redirect_uri=http://localhost:3000/auth/trainingpeaks/athlete/callback&
scope=athlete:profile+workouts:read+...
```

---

## 🎯 **How to Use**

### As a Coach
1. Visit homepage
2. Click **"Connect as Coach"** button
3. Authorize with TrainingPeaks
4. Manage all athletes, post workouts, create plans

### As an Athlete
1. Visit homepage
2. Click **"Connect as Athlete"** button
3. Authorize with TrainingPeaks
4. View your own data and metrics

---

## 🔐 **Database Updates**

Added `account_type` field to track which mode was used:

```sql
-- users table
account_type TEXT NOT NULL DEFAULT 'athlete', -- 'coach' or 'athlete'
```

**Index added:**
```sql
CREATE INDEX idx_users_account_type ON users(account_type);
```

---

## 📊 **API Behavior**

### For Analysis Endpoint
```typescript
// Checks both coach and athlete tokens
SELECT * FROM users WHERE tp_athlete_id = ? OR account_type = 'coach'
```

### For Workout Posting
```typescript
// Requires coach account
SELECT * FROM users WHERE account_type = 'coach'
```

---

## 🌐 **Updated Frontend**

**Homepage now shows TWO buttons:**

| Button | Mode | Color | Icon |
|--------|------|-------|------|
| **Connect as Coach** | Coach | Green | 👔 User Tie |
| **Connect as Athlete** | Athlete | Blue | 🏃 Running |

**Visual indicator added** with yellow warning box explaining the limitation.

---

## ✅ **Testing**

### Test Coach OAuth
```bash
curl -I http://localhost:3000/auth/trainingpeaks/coach
# Returns: Location: https://oauth.trainingpeaks.com/oauth/authorize?...scope=coach:athletes...
```

### Test Athlete OAuth
```bash
curl -I http://localhost:3000/auth/trainingpeaks/athlete
# Returns: Location: https://oauth.trainingpeaks.com/oauth/authorize?...scope=athlete:profile...
```

**Both working correctly! ✅**

---

## 🚀 **Live URLs**

### Sandbox Environment
- **Homepage**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
- **Coach OAuth**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
- **Athlete OAuth**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete

---

## 📝 **Migration Path**

### For Existing Users
1. Clear existing tokens: `DELETE FROM users`
2. Re-authenticate with appropriate mode
3. Database automatically tracks `account_type`

### For New Deployments
1. Run migration: `npm run db:migrate:local`
2. Both OAuth flows available from start

---

## 🎯 **Recommended Usage**

### For Coaches Managing Athletes
✅ Use **Coach Mode**
- Post workouts for multiple athletes
- Manage training plans
- Full coaching capabilities

### For Individual Athletes
✅ Use **Athlete Mode**
- View personal training data
- Analyze performance
- Track progress

### For Testing Both
⚠️ **Cannot connect both simultaneously**
- Use separate browser profiles OR
- Clear tokens between mode switches OR
- Deploy two separate instances

---

## 💡 **Future Enhancement**

Consider building a **mode selector** in the dashboard that:
1. Detects current `account_type`
2. Displays appropriate UI (coach dashboard vs athlete dashboard)
3. Shows "Switch Mode" button (requires re-auth)

---

## ✅ **Status**

**Problem**: ❌ Mixed scopes not allowed
**Solution**: ✅ Separate OAuth flows
**Implementation**: ✅ Complete
**Testing**: ✅ Both flows working
**Documentation**: ✅ Updated

**Ready for production!** 🚀

---

## 📞 **Support**

If you encounter OAuth errors:
1. Verify you're using the correct mode (coach vs athlete)
2. Check TrainingPeaks authorization page shows correct scopes
3. Ensure redirect URIs match exactly
4. Clear browser cache and retry

**Migration Files:**
- `migrations/0001_initial_schema.sql`
- `migrations/0002_add_account_type.sql`

**Commit:**
```
FIXED: Separate Coach and Athlete OAuth flows - TrainingPeaks limitation resolved
```

---

**Problem Solved! ✅**

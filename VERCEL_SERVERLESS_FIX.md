# Vercel Serverless Timeout Fix - Summary & Recommendations

## Problem Identified

Your Vercel deployment was experiencing **504 Gateway Timeout errors** (Vercel Runtime Timeout after 300 seconds) on most API endpoints (`/api/todos`, `/api/auth`, etc.), while simple endpoints like `/health` and `/` worked fine.

### Root Causes

1. **Catch-all route mapping** in `vercel.json`: ALL requests (including static assets like `/vite.svg`, `/pwa-192x192.png`, `/sw.js`) were being routed to the backend serverless function, causing unnecessary cold-starts and overhead.
2. **No internal timeout guard**: If MongoDB connection hung/stalled, the function would hang silently until Vercel force-killed it after 300s.
3. **Inefficient DB connection handling**: DB connection wait wasn't racing with a timeout, so requests could block indefinitely.

---

## Changes Applied

### 1. `apps/backend/vercel.json` - Restrict Routes

**Before:**

```json
"routes": [
  { "src": "/api/(.*)", "dest": "/api/index.js" },
  { "src": "/(.*)", "dest": "/api/index.js" }  // Catches everything!
]
```

**After:**

```json
"routes": [
  { "src": "/api/(.*)", "dest": "/api/index.js" },
  { "src": "/api-docs/(.*)", "dest": "/api/index.js" },
  { "src": "/health", "dest": "/api/index.js" },
  { "src": "/health-checks", "dest": "/api/index.js" }
]
```

**Impact:** Static assets and frontend routes no longer trigger backend function, reducing cold-starts and function overhead.

---

### 2. `apps/backend/api/index.js` - Enhanced Safety & Logging

#### Key Improvements:

**a) Request ID Tracking**

- Each request now gets a unique ID (e.g., `REQ-a3f7b2c`)
- All logs for that request use the same ID for easy tracing

**b) Internal Timeout Guard**

- 10-second safety timeout set immediately when request arrives
- If no response sent by 10s, function automatically returns 504 (instead of Vercel waiting 300s)
- Prevents function from hanging silently

**c) DB Connection Timeout Racing**

```javascript
await Promise.race([
  ensureDBConnection(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("DB connect timeout after 7s")), 7000)
  ),
]);
```

- If DB connection takes >7s, function returns 503 Service Unavailable
- Ensures function never hangs on slow/unreachable database

**d) Detailed Logging**

Example log output for a request:

```
[REQ-a3f7b2c] [2024-11-17T16:20:38.123Z] GET /api/todos
[REQ-a3f7b2c] Auth: ✓ Bearer, ContentType: application/json
[REQ-a3f7b2c] Route type: REQUIRES_DB
[REQ-a3f7b2c] [DB] 🔄 Starting new connection attempt #1 (current state: disconnected)
[DB] ✅ Connection attempt #1 succeeded
[REQ-a3f7b2c] [DB] ✅ Connected in 523ms
[REQ-a3f7b2c] [EXPRESS] Routing to Express handler...
[REQ-a3f7b2c] ✅ Response sent: 342ms | GET /api/todos
```

---

## What To Do Next

### 1. Deploy Changes

```bash
cd <repo-root>
git add -A
git commit -m "Fix: tighten Vercel routes and add serverless safety timeout with enhanced logging"
git push
# Vercel will auto-deploy, or manually:
vercel --prod
```

### 2. Verify Vercel Environment Variables

Go to **Vercel Dashboard > Settings > Environment Variables** and confirm:

| Variable      | Required | Example                                                               |
| ------------- | -------- | --------------------------------------------------------------------- |
| `MONGODB_URI` | ✅ Yes   | `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true` |
| `JWT_SECRET`  | ✅ Yes   | Any secure random string (e.g., from `openssl rand -hex 32`)          |
| `NODE_ENV`    | ✅ Yes   | `production`                                                          |

### 3. MongoDB Connection Access

If using **MongoDB Atlas**:

- Ensure **Network Access** allows Vercel IP ranges or use `0.0.0.0/0` (less secure but simpler for testing)
- Use a MongoDB user with minimal required permissions
- Test connection string locally: `mongosh "<MONGODB_URI>"`

### 4. Monitor Logs

After deploying:

1. Open Vercel Dashboard > Deployments > Logs
2. Make requests to `/api/todos`, `/api/auth/register`, etc.
3. Look for logs like:
   - ✅ `[DB] ✅ Connected in XXXms` → DB connection OK
   - ❌ `[DB] ❌ Connection failed: ...` → DB connectivity issue
   - ⏱️ `TIMEOUT after 10000ms` → Function took too long (should rarely happen now)

### 5. Troubleshooting by HTTP Status

| Status  | Cause                                    | Action                                              |
| ------- | ---------------------------------------- | --------------------------------------------------- |
| **504** | Request exceeded 10s internal timeout    | Check Express handler speed, DB query performance   |
| **503** | DB connection took >7s or failed         | Check MongoDB URI, network access, Database latency |
| **500** | Express handler error (route/validation) | Check application logs for specific error message   |
| **401** | Missing/invalid JWT token                | Ensure `Authorization: Bearer <token>` header       |
| **200** | Success                                  | Should see logs with `✅ Connected in XXms`         |

### 6. Recommended Vercel Settings

- **Function Max Duration**: Leave at default (10s for Pro) or increase if needed
- **Memory**: 512 MB (default) should be sufficient
- **Regions**: Keep auto-selected unless latency is an issue

### 7. Optional: Adjust Timeouts

Edit `TIMEOUT_MS` and `DB_TIMEOUT_MS` in `apps/backend/api/index.js` if needed:

```javascript
const TIMEOUT_MS = 10000; // Total request timeout (currently 10s)
// and in ensureDBConnection race:
setTimeout(() => reject(new Error("DB connect timeout after 7s")), 7000); // DB timeout (currently 7s)
```

**Recommendation:** Keep 10s/7s unless you have specific slow queries that need longer.

---

## Expected Behavior After Fix

### Before Fix

```
GET /api/todos → [hangs] → Vercel kills after 300s → 504 timeout
```

### After Fix

```
GET /api/todos (no DB connection)
  → [0ms] Route identified as DB-requiring
  → [< 7s] Connect to MongoDB
  → [< 10s total] Return response (200 or 503)
  → Log shows: "[REQ-xxx] ✅ Response sent: 342ms"
```

---

## Summary of Changes

| File           | Change                             | Impact                                          |
| -------------- | ---------------------------------- | ----------------------------------------------- |
| `vercel.json`  | Remove catch-all route `/(.*)`     | Static assets skip function, faster cold-starts |
| `api/index.js` | Add 10s timeout guard              | Function never hangs >10s                       |
| `api/index.js` | Race DB connection with 7s timeout | DB stalls return 503 quickly                    |
| `api/index.js` | Enhanced logging with request IDs  | Easier debugging & monitoring                   |

---

## Quick Health Check

After deployment, test each endpoint:

```bash
# Should return 200 instantly
curl https://monorepo-todo-auth-railway-vercel-b.vercel.app/health

# Should return 200 instantly (different response format)
curl https://monorepo-todo-auth-railway-vercel-b.vercel.app/

# Should return 200 or 401 (depends on auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://monorepo-todo-auth-railway-vercel-b.vercel.app/api/todos

# Check Vercel logs
vercel logs <deployment-id>
```

---

## Contact / Questions

If you still see 504 errors after these changes:

1. Check Vercel logs for `[DB] ❌` errors (DB connection problem)
2. Check if `MONGODB_URI` and `JWT_SECRET` are set correctly
3. Verify MongoDB Atlas Network Access includes Vercel
4. Check MongoDB Atlas cluster status (not suspended/paused)

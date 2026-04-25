# 🏗️ Rate Limiting Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Components                             │
│         (Dashboard, Profile, Events, etc.)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Call DB Functions
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              lib/db.ts (Database Layer)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ getUserData(uid, userId, userRole)                      │   │
│  │ getAllEvents(userId, userRole)                          │   │
│  │ updateUser(uid, updates, userId, userRole)             │   │
│  │ ... 30+ functions                                        │   │
│  └─────────────┬──────────────────────────────────────────┘   │
│                │ Check Rate Limit                              │
│                │ (enforceRateLimit)                            │
│                ▼                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ lib/rateLimiter.ts                                      │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ rateLimitConfig                                     │ │   │
│  │ │ ├─ getUserData: { user: 100, admin: 1000 }         │ │   │
│  │ │ ├─ getAllEvents: { user: 50, admin: 500 }          │ │   │
│  │ │ ├─ deleteEvent: { user: 0, admin: 50 }            │ │   │
│  │ │ └─ ... 20+ functions                               │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  │ ┌─────────────────────────────────────────────────────┐ │   │
│  │ │ In-Memory Store (Map<string, RequestCount>)        │ │   │
│  │ │ Key: "functionName:userId"                          │ │   │
│  │ │ Value: { count: 5, resetAt: 1234567890 }           │ │   │
│  │ └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Allowed? ─────► Continue to Firebase                          │
│  Blocked? ─────► throw RateLimitExceededError                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                      Firebase Firestore
                   (Kontrollierte Datenbankzugriffe)
```

## Data Flow

```
User Action (e.g., Load Events)
    │
    ├─► getUserData(targetId, userId, userRole)
    │       │
    │       ├─► enforceRateLimit("getUserData", userId, userRole)
    │       │       │
    │       │       ├─► Get config limits
    │       │       │
    │       │       ├─► Check in-memory store
    │       │       │
    │       │       ├─► Count < Limit?
    │       │       │   ├─ YES ─► Increment count & return true
    │       │       │   └─ NO ──► return false
    │       │       │
    │       │       └─► Throw RateLimitExceededError if blocked
    │       │
    │       ├─► Query Firebase
    │       └─► Return data
    │
    └─► Catch RateLimitExceededError
            └─► Show error message to user
```

## Request Limit Window (60 seconds = 1 Minute)

```
Time ──────────────────────────────────────────────────────────────►

User: john_doe makes 100 requests to getUserData
     │
     ├─ Request 1  ✅ Allowed  (count: 1)
     ├─ Request 2  ✅ Allowed  (count: 2)
     ├─ Request 3  ✅ Allowed  (count: 3)
     │   ...
     ├─ Request 99 ✅ Allowed  (count: 99)
     ├─ Request 100✅ Allowed  (count: 100)
     ├─ Request 101❌ BLOCKED  (Limit exceeded!)
     │
     └─ After 60 seconds: Window resets ↻
        └─ Request 102✅ Allowed  (count: 1)

```

## Role Hierarchy

```
                    Permissions Level

                        ▲
                        │
            ┌───────────┤
            │           │
           User        Admin      ← Can do anything
            │           │
            │      ┌────┴────┐
            │      │         │
          Mentor  Friend    Bot
            │
            │ Lower permissions
            ▼

Limits per function:
  • User:   5-100 requests/minute
  • Mentor: 20-500 requests/minute
  • Admin:  50-1000 requests/minute

Some operations blocked for non-admins:
  • deleteEvent (user: 0)
  • deleteCourse (user: 0)
  • deleteAnnouncement (user: 0)
```

## Rate Limit States

```
STATE MACHINE:

    ┌──────────────────────────────────────────────────────┐
    │                                                      │
    ▼                                                      │
WAITING FOR REQUEST                    NEW WINDOW STARTS
    │                                        ▲
    │ (limit not exceeded)                   │
    ├──────► CHECK RATE LIMIT                │
    │            │                           │
    │            ├─► Within Limit?           │
    │            │   ├─ YES ──────────────┐  │
    │            │   └─ NO ───────┐       │  │
    │            │                │       │  │
    │            └────────────────┼───────┼──┘
    │                             │       │
    │              ┌──────────────┘       ├──► ALLOWED
    │              │                      │
    ▼              ▼                      │
BLOCKED ◄─────────► THROW ERROR           │
    │                                     │
    │                          ┌──────────┘
    │                          │
    ▼                          ▼
WAIT 60 SEC              CONTINUE TO DB
    │                          │
    └──────────────────────────┘

```

## In-Memory Store Structure

```
store Map:

  Key: "functionName:userId"
  Value: { count, resetAt }

Example for 3 concurrent users:

"getUserData:alice" → { count: 23, resetAt: 1713816000000 }
"getUserData:bob"   → { count: 15, resetAt: 1713816000000 }
"getUserData:carol" → { count: 89, resetAt: 1713816000000 }

"updateUser:alice"  → { count: 5,  resetAt: 1713816000000 }
"deleteEvent:bob"   → (blocked, count never reaches 1)

Memory Usage per user: ~50 bytes
Total for 1000 users: ~50 KB
```

## Configuration Example

```typescript
rateLimitConfig = {
  getUserData: {
    user:   { maxRequests: 100, windowMs: 60000 }, // 100 per minute
    admin:  { maxRequests: 1000, windowMs: 60000 }, // 10x
    mentor: { maxRequests: 500, windowMs: 60000 }   // 5x
  },
  
  deleteEvent: {
    user:   { maxRequests: 0, windowMs: 60000 },    // BLOCKED
    admin:  { maxRequests: 50, windowMs: 60000 },   // Allowed
    mentor: { maxRequests: 0, windowMs: 60000 }     // BLOCKED
  },
  
  addEvent: {
    user:   { maxRequests: 1, windowMs: 3600000 },  // 1 per hour
    admin:  { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 }
  }
}
```

## Performance Characteristics

```
Operation           Time        Memory      Scalability
────────────────────────────────────────────────────────
checkRateLimit      <0.5ms      ~50B        O(1)
RateLimitExceeded   <0.1ms      0B          O(1)
Storage Cleanup     Lazy        Varies      O(n) when reset

Total per request:  <1ms        50B         Linear with users
```

## Error Handling Flow

```
try {
  await getUserData(uid, userId, userRole)
     │
     └─► Rate limit check
          │
          ├─ Allowed ──► Query Firebase ──► Return data
          │
          └─ Blocked ──► throw RateLimitExceededError
}
catch (error) {
  if (error instanceof RateLimitExceededError) {
    ├─► Show toast: "Zu viele Anfragen"
    ├─► Disable button for 1 second
    └─► Log attempt
  } else {
    ├─► Show generic error
    └─► Log error
  }
}
```

## Integration Points

```
Frontend (React)
    │
    ├─► useAuth() ──► Get user.id and user.role
    │
    ├─► try/catch ──► Handle RateLimitExceededError
    │
    └─► Call DB functions with (id, userId, userRole)
            │
            └─► lib/db.ts
                    │
                    └─► lib/rateLimiter.ts
                            │
                            └─► Firebase
```

## Deployment Architecture (Vercel)

```
Request from browser
    │
    ▼
Vercel Function (Next.js API Route)
    │
    ├─► Authenticate user
    │
    ├─► Get userId + userRole
    │
    ├─► Call DB function
    │   │
    │   └─► Rate limiter checks (in-memory)
    │       │
    │       ├─ Allowed ──► Firebase query
    │       └─ Blocked ──► Return 429 error
    │
    └─► Return response (200 or 429)
            │
            ▼
        Response to browser
            │
            ├─► 200 + data ──► Display
            └─► 429 Error ──► Show "Too many requests"

Memory persists:
  ✅ Within same request
  ✅ Between requests (until Vercel cold start)
  ❌ After Vercel cold start (resets)
```

## Monitoring & Debugging

```
Check Rate Limit Status:
  import { getRateLimitStatus } from "@/lib/rateLimiter"
  
  const status = getRateLimitStatus("getUserData", userId)
  // { count: 50, resetAt: 1713816060000, now: 1713815950000 }

Logs to monitor:
  • Firebase read count
  • RateLimitExceededError frequency
  • API response times (should stay <1ms overhead)
```

---

**Last Updated:** 2026-04-22
**Version:** 1.0
**Status:** ✅ Documented

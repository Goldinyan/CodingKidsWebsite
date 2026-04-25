# Rate Limiting Guide

## Überblick

Das Rate Limiting System schützt deine Firebase Datenbank vor Abuse und unkontrolliertem Datenzugriff. Alle DB-Funktionen haben unterschiedliche Limits basierend auf der Benutzerrolle.

## Implementierung

### 1. In deinen Komponenten

Alle DB-Funktionen benötigen jetzt zwei zusätzliche Parameter:

```typescript
import { getUserData } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext"; // oder wo dein Auth Context ist

export async function MyComponent() {
  const { user } = useAuth();
  const userData = getUserData(userId, userAuth, userData?.role as UserRole);
}
```

### 2. Funktion Signature

**Alte Signatur:**
```typescript
export async function getUserData(uid: string): Promise<UserData | null>
```

**Neue Signatur:**
```typescript
export async function getUserData(
  uid: string, 
  userId: string = "anonymous", 
  userRole: UserRole = "user"
): Promise<UserData | null>
```

### 3. Parameter Erklärung

- **uid**: Die Nutzer-ID deren Daten gelesen werden sollen
- **userId**: Die Nutzer-ID der Person die die Anfrage macht (für Rate Limiting)
- **userRole**: Die Rolle des Nutzers ("user" | "admin" | "mentor")

## Rate Limits

### Read Operations (Billig - hohe Limits)

| Funktion | User | Admin | Mentor |
|----------|------|-------|--------|
| `getUserData` | 100/min | 1000/min | 500/min |
| `getAllEvents` | 50/min | 500/min | 200/min |
| `getAllCourses` | 30/min | 300/min | 150/min |
| `getAllMentors` | 50/min | 500/min | 200/min |
| `getAllAnnouncements` | 30/min | 300/min | 100/min |

### Write Operations (Teuer - niedrige Limits)

| Funktion | User | Admin | Mentor |
|----------|------|-------|--------|
| `updateUser` | 20/min | 200/min | 50/min |
| `updateEvent` | 5/min | 100/min | 50/min |
| `addEvent` | 1/h | 50/min | 20/min |
| `deleteEvent` | 0 | 50/min | 10/min |
| `addUserToEvent` | 30/min | 500/min | 200/min |
| `removeUserFromEvent` | 30/min | 500/min | 200/min |

## Error Handling

Wenn ein Nutzer das Limit überschreitet, wirft die Funktion einen `RateLimitExceededError`:

```typescript
import { RateLimitExceededError } from "@/lib/rateLimiter";

try {
  await getUserData(uid, userId, userRole);
} catch (error) {
  if (error instanceof RateLimitExceededError) {
    // User hat zu viele Anfragen gemacht
    toast.error("Zu viele Anfragen. Bitte warten Sie einen Moment.");
  }
}
```

## Wo du User ID und Role bekommst

### Aus Firebase Auth Context

```typescript
import { useAuth } from "@/BackEnd/AuthContext";

export function MyComponent() {
  const { user } = useAuth();
  
  // user.uid = userId
  // user.? = role (wo speicherst du das?)
}
```

### Von Firestore User Daten

```typescript
const userData = await getUserData(userId, userId, userData.role as UserRole);
```

### In API Routes

```typescript
export async function GET(req: Request) {
  const session = await auth.getSession(); // oder deine Auth Methode
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  
  const result = await getAllEvents(userId, userRole);
  return NextResponse.json(result);
}
```

## Anpassung der Limits

Die Limits sind in `lib/rateLimiter.ts` konfiguriert:

```typescript
export const rateLimitConfig = {
  getUserData: {
    user: { maxRequests: 100, windowMs: 60000 }, // 100 in 60 Sekunden
    admin: { maxRequests: 1000, windowMs: 60000 },
    mentor: { maxRequests: 500, windowMs: 60000 },
  },
  // ... weitere Funktionen
};
```

### Um Limits zu ändern:

1. Öffne `lib/rateLimiter.ts`
2. Ändere die Werte in `rateLimitConfig`
3. Format: `{ maxRequests: 100, windowMs: 60000 }` = 100 Anfragen pro 60 Sekunden
4. Speichere - Änderungen sind sofort aktiv

## Performance

✅ **Sehr schnell:** <1ms pro Rate Limit Check
✅ **In-Memory:** Keine externe Service nötig
✅ **Scalable:** Mit Vercel kein Problem
✅ **Automatisch bereinigt:** Alte Einträge werden überschrieben

## Tipps

1. **Für normale User:** Nutze die "user" Limits
2. **Für Admins:** Nutze "admin" für höhere Limits
3. **Für Mentoren:** Nutze "mentor" für mittlere Limits
4. **Fehlende User-ID:** Nutze "anonymous" als Default

## Debugging

### Rate Limit Status anschauen:

```typescript
import { getRateLimitStatus } from "@/lib/rateLimiter";

const status = getRateLimitStatus("getUserData", userId);
console.log(status); // { count: 5, resetAt: 1234567890, now: 1234567000 }
```

## FAQ

**Q: Was passiert wenn ein User das Limit überschreitet?**
A: Ein `RateLimitExceededError` wird geworfen. Du kannst das mit try/catch abfangen.

**Q: Können die Limits sich während Runtime ändern?**
A: Nein, sie sind hardcoded in `rateLimitConfig`. Ändere die Werte dort um sie anzupassen.

**Q: Funktioniert das mit mehreren Server Instanzen?**
A: Nein, das ist nur für single server. Für mehrere Server brauchst du Redis.

**Q: Wie lang ist das Fenster?**
A: Standard ist 60 Sekunden (60000 ms). Das ist in `rateLimitConfig` konfigurierbar.

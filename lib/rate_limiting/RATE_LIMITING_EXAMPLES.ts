// Example: How to use Rate Limiting in your Components

// ============================================================
// EXAMPLE 1: In a React Component (Client-Side)
// ============================================================

import { useEffect, useState } from "react";
import { getUserData, getAllEvents } from "@/lib/db";
import { useAuth } from "@/BackEnd/AuthContext";
import type { UserData, EventData } from "@/BackEnd/type";
import type { UserRole } from "@/lib/rateLimiter";
import { RateLimitExceededError } from "@/lib/rateLimiter";

export function ProfileComponent() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) return;

        // Get user data with rate limiting
        // Parameters: (uid, userId, userRole)
        const data = await getUserData(
          user.uid,
          user.uid, // The person making the request
          "user" // The role of the person making the request
        );

        setUserData(data);
        setError(null);
      } catch (err) {
        if (err instanceof RateLimitExceededError) {
          setError(
            "Zu viele Anfragen. Bitte warten Sie ein paar Sekunden bevor Sie es erneut versuchen."
          );
        } else {
          setError("Fehler beim Laden der Benutzerdaten");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <div>Lädt...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1>{userData?.name}</h1>
      <p>{userData?.email}</p>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: With Admin Access
// ============================================================

export function AdminDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (!user) return;

        // Admin can make more requests
        const allEvents = await getAllEvents(
          user.uid,
          "admin" // Admin role allows higher limits
        );

        setEvents(allEvents);
      } catch (err) {
        if (err instanceof RateLimitExceededError) {
          console.error("Admin rate limit exceeded");
        }
      }
    };

    fetchEvents();
  }, [user]);

  return (
    <div>
      <h1>Events Dashboard ({events.length})</h1>
      {/* ... render events ... */}
    </div>
  );
}

// ============================================================
// EXAMPLE 3: In an API Route (Server-Side)
// ============================================================

// pages/api/events.ts or src/app/api/events/route.ts

import { NextResponse } from "next/server";
import { getAllEvents } from "@/lib/db";
import type { UserRole } from "@/lib/rateLimiter";
import { RateLimitExceededError } from "@/lib/rateLimiter";

export async function GET(req: Request) {
  try {
    // Get user info from session/auth
    // This is pseudo-code - adapt to your auth system
    const session = await getSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userRole = (session.user.role || "user") as UserRole;

    // Fetch events with rate limiting
    const events = await getAllEvents(userId, userRole);

    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 } // 429 Too Many Requests
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ============================================================
// EXAMPLE 4: Handling Rate Limits in Forms
// ============================================================

import { updateUser } from "@/lib/db";
import type { UserData } from "@/BackEnd/type";
import { toast } from "@/components/ui/use-toast";

export function EditProfileForm({ userId, userRole }: { userId: string; userRole: UserRole }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<UserData>) => {
    setSubmitting(true);

    try {
      // Update with rate limiting
      await updateUser(
        userId,
        formData,
        userId, // Who's making the request
        userRole // Their role
      );

      toast({
        title: "Erfolg",
        description: "Profil aktualisiert",
      });
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        toast({
          title: "Zu viele Anfragen",
          description: "Bitte warten Sie einen Moment bevor Sie es erneut versuchen.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: "Fehler beim Aktualisieren des Profils",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(/* form data */);
    }}>
      {/* ... form fields ... */}
      <button disabled={submitting} type="submit">
        {submitting ? "Speichert..." : "Speichern"}
      </button>
    </form>
  );
}

// ============================================================
// EXAMPLE 5: Batch Operations
// ============================================================

import { addUserToEvent, removeUserFromEvent } from "@/lib/db";

export async function batchRegisterUsers(
  eventId: string,
  userIds: string[],
  adminId: string
) {
  const results = [];

  for (const userId of userIds) {
    try {
      // Each call respects rate limiting
      await addUserToEvent(
        eventId,
        userId,
        adminId, // Admin making the request
        "admin"
      );

      results.push({ userId, success: true });
    } catch (error) {
      if (error instanceof RateLimitExceededError) {
        // Hit rate limit - could implement retry logic
        console.warn(`Rate limited while adding user ${userId}`);
        results.push({ userId, success: false, reason: "rate_limited" });
      } else {
        results.push({ userId, success: false, reason: "error" });
      }
    }
  }

  return results;
}

// ============================================================
// EXAMPLE 6: Custom Error Messages
// ============================================================

export function getErrorMessage(error: unknown, functionName: string): string {
  if (error instanceof RateLimitExceededError) {
    return `Sie machen zu viele Anfragen für "${functionName}". Bitte warten Sie einen Moment.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ein unbekannter Fehler ist aufgetreten";
}

// Usage:
try {
  await getUserData(uid, userId, userRole);
} catch (error) {
  const message = getErrorMessage(error, "getUserData");
  toast({ description: message });
}

// ============================================================
// SUMMARY
// ============================================================

/*
Key points when using Rate Limiting:

1. ALWAYS pass userId and userRole to DB functions
   ✅ await getUserData(uid, userId, userRole)
   ❌ await getUserData(uid)

2. Use correct role:
   - "user" for regular users
   - "admin" for administrators
   - "mentor" for mentors

3. Handle RateLimitExceededError:
   if (error instanceof RateLimitExceededError) {
     // Show user-friendly error message
   }

4. Response codes in API:
   - 429 Too Many Requests (when rate limited)
   - 401 Unauthorized (when no auth)
   - 500 Internal Server Error (other errors)

5. Test your limits:
   - Run example code to see when limits kick in
   - Check with getRateLimitStatus() for debugging
*/

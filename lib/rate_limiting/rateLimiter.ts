// lib/rateLimiter.ts
// In-memory rate limiting for database operations

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

export type UserRole = "user" | "admin" | "mentor";

// Configuration for different functions and roles
// Format: { functionName: { roleType: { maxRequests, windowMs } } }
export const rateLimitConfig = {
  // Read operations (high limit - these are cheap)
  getUserData: {
    user: { maxRequests: 100, windowMs: 60000 }, // 100 per minute
    admin: { maxRequests: 1000, windowMs: 60000 }, // 1000 per minute
    mentor: { maxRequests: 500, windowMs: 60000 }, // 500 per minute
  },
  getAllUsers: {
    user: { maxRequests: 5, windowMs: 60000 }, // Only admins/mentors should call this
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
  },
  getAllEvents: {
    user: { maxRequests: 50, windowMs: 60000 },
    admin: { maxRequests: 500, windowMs: 60000 },
    mentor: { maxRequests: 200, windowMs: 60000 },
  },
  getAllCourses: {
    user: { maxRequests: 30, windowMs: 60000 },
    admin: { maxRequests: 300, windowMs: 60000 },
    mentor: { maxRequests: 150, windowMs: 60000 },
  },
  getAllMentors: {
    user: { maxRequests: 50, windowMs: 60000 },
    admin: { maxRequests: 500, windowMs: 60000 },
    mentor: { maxRequests: 200, windowMs: 60000 },
  },
  getAllAnnouncements: {
    user: { maxRequests: 30, windowMs: 60000 },
    admin: { maxRequests: 300, windowMs: 60000 },
    mentor: { maxRequests: 100, windowMs: 60000 },
  },
  getAllAdmins: {
    user: { maxRequests: 1, windowMs: 60000 }, // Should not be called by users
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 5, windowMs: 60000 },
  },

  // Write operations (lower limit - these are expensive)
  updateUser: {
    user: { maxRequests: 20, windowMs: 60000 }, // Users can update themselves
    admin: { maxRequests: 200, windowMs: 60000 },
    mentor: { maxRequests: 50, windowMs: 60000 },
  },
  updateEvent: {
    user: { maxRequests: 5, windowMs: 60000 },
    admin: { maxRequests: 100, windowMs: 60000 },
    mentor: { maxRequests: 50, windowMs: 60000 },
  },
  addEvent: {
    user: { maxRequests: 1, windowMs: 3600000 }, // 1 per hour for users
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
  },
  deleteEvent: {
    user: { maxRequests: 0, windowMs: 60000 }, // Users cannot delete events
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
  },
  addUserToEvent: {
    user: { maxRequests: 30, windowMs: 60000 }, // Users joining events
    admin: { maxRequests: 500, windowMs: 60000 },
    mentor: { maxRequests: 200, windowMs: 60000 },
  },
  removeUserFromEvent: {
    user: { maxRequests: 30, windowMs: 60000 },
    admin: { maxRequests: 500, windowMs: 60000 },
    mentor: { maxRequests: 200, windowMs: 60000 },
  },
  isUserInEvent: {
    user: { maxRequests: 100, windowMs: 60000 },
    admin: { maxRequests: 1000, windowMs: 60000 },
    mentor: { maxRequests: 500, windowMs: 60000 },
  },
  updateCourse: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 100, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
  },
  addCourse: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 5, windowMs: 60000 },
  },
  deleteCourse: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
  },
  updateAnnouncement: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 100, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
  },
  addAnnouncement: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
  },
  deleteAnnouncement: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 100, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
  },
  updateMentor: {
    user: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 50, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
  },
} as const;

// Store for tracking requests
const store: RateLimitStore = {};

/**
 * Check if a request should be allowed based on rate limiting
 * @param functionName - Name of the DB function being called
 * @param userId - Unique identifier for the user/request
 * @param userRole - Role of the user (user, admin, mentor)
 * @returns true if request is allowed, false if rate limited
 * @throws Error if function name or role is not configured
 */
export function checkRateLimit(
  functionName: keyof typeof rateLimitConfig,
  userId: string,
  userRole: UserRole,
): boolean {
  const now = Date.now();
  const key = `${functionName}:${userId}`;

  // Get the rate limit config for this function and role
  const config = rateLimitConfig[functionName];
  if (!config) {
    throw new Error(`Rate limit config not found for function: ${functionName}`);
  }

  const limits = config[userRole as keyof typeof config];
  if (!limits) {
    throw new Error(
      `Rate limit config not found for function: ${functionName}, role: ${userRole}`,
    );
  }

  const { maxRequests, windowMs } = limits;

  // If max requests is 0, deny access
  if (maxRequests === 0) {
    return false;
  }

  // Initialize or reset the store entry
  if (!store[key]) {
    store[key] = { count: 0, resetAt: now + windowMs };
  }

  // Reset if window has expired
  if (now > store[key].resetAt) {
    store[key] = { count: 1, resetAt: now + windowMs };
    return true;
  }

  // Check if limit exceeded
  if (store[key].count < maxRequests) {
    store[key].count++;
    return true;
  }

  return false;
}

/**
 * Get current rate limit status for debugging
 */
export function getRateLimitStatus(
  functionName: keyof typeof rateLimitConfig,
  userId: string,
): { count: number; resetAt: number; now: number } | null {
  const key = `${functionName}:${userId}`;
  if (!store[key]) {
    return null;
  }
  return {
    count: store[key].count,
    resetAt: store[key].resetAt,
    now: Date.now(),
  };
}

/**
 * Custom error class for rate limit exceeded
 */
export class RateLimitExceededError extends Error {
  constructor(
    functionName: string,
    userRole: string,
    retryAfter?: number,
  ) {
    const message = `Rate limit exceeded for ${functionName} (${userRole}). Retry after ${retryAfter}ms`;
    super(message);
    this.name = "RateLimitExceededError";
  }
}

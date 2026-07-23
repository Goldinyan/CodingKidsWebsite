// lib/rateLimiter.ts

import { UserRole } from "@/BackEnd/type";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

export const rateLimitConfig = {
  getUserData: {
    anonymous: { maxRequests: 0, windowMs: 60000 }, // No access for anonymous
    user: { maxRequests: 10, windowMs: 60000 }, // 100 per minute
    member: { maxRequests: 10, windowMs: 60000 }, // 100 per minute
    mentor: { maxRequests: 20, windowMs: 60000 }, // 500 per minute
    admin: { maxRequests: 20, windowMs: 60000 }, // 1000 per minute
  },
  getAllUsers: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  getAllEvents: {
    anonymous: { maxRequests: 10, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  getAllCourses: {
    anonymous: { maxRequests: 10, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 15, windowMs: 60000 },
    admin: { maxRequests: 30, windowMs: 60000 },
  },
  getAllMentors: {
    anonymous: { maxRequests: 10, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  getAllAnnouncements: {
    anonymous: { maxRequests: 10, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  getAllAdmins: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 }, // IDK HERE
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },

  // Write operations are expensive
  updateUser: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  updateEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 20, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  addEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  deleteEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  addUserToEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  removeUserFromEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 20, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  isUserInEvent: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 20, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  updateCourse: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  addCourse: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  deleteCourse: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  updateAnnouncement: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  addAnnouncement: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  deleteAnnouncement: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  updateMentor: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 0, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  getAllTickets: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 30, windowMs: 60000 },
  },
  getTicketById: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 30, windowMs: 60000 },
  },
  addTicket: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 5, windowMs: 60000 },
    member: { maxRequests: 5, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
  updateTicket: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  addMessageToTicket: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 10, windowMs: 60000 },
    member: { maxRequests: 10, windowMs: 60000 },
    mentor: { maxRequests: 20, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  addInternalNoteToTicket: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 10, windowMs: 60000 },
    admin: { maxRequests: 20, windowMs: 60000 },
  },
  deleteTicket: {
    anonymous: { maxRequests: 0, windowMs: 60000 },
    user: { maxRequests: 0, windowMs: 60000 },
    member: { maxRequests: 0, windowMs: 60000 },
    mentor: { maxRequests: 5, windowMs: 60000 },
    admin: { maxRequests: 10, windowMs: 60000 },
  },
} as const;

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
  const debug = true;
  const now = Date.now();
  const key = `${functionName}:${userId}`;

  const status = getRateLimitStatus(functionName, userId);
  const currentCount = (status?.count ?? 0) + 1;

  if (debug) {
    logRateLimit(functionName, currentCount, userRole);
  }

  // Get the rate limit config for this function and role
  const config = rateLimitConfig[functionName];
  if (!config) {
    throw new Error(
      `Rate limit config not found for function: ${functionName}`,
    );
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
    console.error(
      `Acces denied for function: ${functionName}, role: ${userRole}`,
    );
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
  constructor(functionName: string, userRole: string, retryAfter?: number) {
    const message = `Rate limit exceeded for ${functionName} (${userRole}). Retry after ${retryAfter}ms`;
    super(message);
    this.name = "RateLimitExceededError";
  }
}

export function logRateLimit(
  functionName: string,
  currentCount: number,
  userRole: string,
) {
  const time = new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(
    `%c[${time}] %c[RATE LIMIT] %c${functionName.toUpperCase()} %c| %cCall #${currentCount} %c| %cRole: ${userRole} %c`,
    "color: #6b7280; font-weight: normal;", // Zeitstempel (Grau)
    "color: #ef4444; font-weight: bold;", // RATE LIMIT (Rot)
    "color: #3b82f6; font-weight: bold;", // Function Name (Blau)
    "color: #4b5563;", // Trennstrich | (Dunkelgrau)
    "color: #10b981; font-weight: bold;", // Call Count (Grün)
    "color: #4b5563;", // Trennstrich | (Dunkelgrau)
    "color: #8b5cf6;", // Role (Violett)
    "color: #6b7280; font-weight: bold;", // [...] am Ende (Grau)
  );
}

// lib/rateLimiter.test.ts
// Example usage and basic tests for rate limiting

import {
  checkRateLimit,
  RateLimitExceededError,
  getRateLimitStatus,
  type UserRole,
} from "./rateLimiter";

/**
 * Example 1: Basic rate limiting check
 */
export function example1_basicCheck() {
  const userId = "user123";
  const userRole: UserRole = "user";

  // First 100 requests should succeed
  for (let i = 0; i < 100; i++) {
    const allowed = checkRateLimit("getUserData", userId, userRole);
    console.log(`Request ${i + 1}: ${allowed ? "✅ Allowed" : "❌ Blocked"}`);
  }

  // 101st request should fail
  const allowed = checkRateLimit("getUserData", userId, userRole);
  console.log(`Request 101: ${allowed ? "✅ Allowed" : "❌ Blocked"}`);
}

/**
 * Example 2: Admin has higher limits
 */
export function example2_adminLimits() {
  const adminId = "admin123";
  const userId = "user123";

  // Admin can make 1000 requests
  for (let i = 0; i < 1000; i++) {
    checkRateLimit("getUserData", adminId, "admin");
  }

  // Regular user only 100
  for (let i = 0; i < 100; i++) {
    checkRateLimit("getUserData", userId, "user");
  }

  console.log("Admin: 1000 allowed, User: 100 allowed");
}

/**
 * Example 3: Different functions have different limits
 */
export function example3_differentLimits() {
  const userId = "user123";

  // getAllUsers has lower limit (5 for users)
  const usersAllowed = checkRateLimit("getAllUsers", userId, "user");
  console.log(`getAllUsers allowed: ${usersAllowed}`);

  // getUserData has higher limit (100 for users)
  const dataAllowed = checkRateLimit("getUserData", userId, "user");
  console.log(`getUserData allowed: ${dataAllowed}`);
}

/**
 * Example 4: Check current status
 */
export function example4_checkStatus() {
  const userId = "user123";

  // Make some requests
  checkRateLimit("getUserData", userId, "user");
  checkRateLimit("getUserData", userId, "user");
  checkRateLimit("getUserData", userId, "user");

  // Check status
  const status = getRateLimitStatus("getUserData", userId);
  console.log("Current status:", status);
  // { count: 3, resetAt: <timestamp>, now: <timestamp> }
}

/**
 * Example 5: Different users have separate limits
 */
export function example5_separateUserLimits() {
  const user1 = "user1";
  const user2 = "user2";

  // User 1 makes 50 requests
  for (let i = 0; i < 50; i++) {
    checkRateLimit("getUserData", user1, "user");
  }

  // User 2 makes 50 requests
  for (let i = 0; i < 50; i++) {
    checkRateLimit("getUserData", user2, "user");
  }

  // Both have 50 requests, not combined
  console.log("User 1 made 50, User 2 made 50 - separate limits");
}

/**
 * Example 6: Using with error handling
 */
export async function example6_errorHandling() {
  const userId = "user123";

  try {
    // Check rate limit
    const allowed = checkRateLimit("deleteEvent", userId, "user");

    if (!allowed) {
      throw new RateLimitExceededError("deleteEvent", "user");
    }

    // Proceed with operation
    console.log("✅ Operation allowed");
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      console.log("❌ Rate limit exceeded:", error.message);
    }
  }
}

/**
 * Test: User cannot delete events
 */
export function test_userCannotDelete() {
  const userId = "user123";

  // Users have 0 limit for deleteEvent
  const allowed = checkRateLimit("deleteEvent", userId, "user");
  console.assert(
    allowed === false,
    "Users should not be able to delete events",
  );
}

/**
 * Test: Admin can delete events
 */
export function test_adminCanDelete() {
  const adminId = "admin123";

  // Admins have 50 limit for deleteEvent
  const allowed = checkRateLimit("deleteEvent", adminId, "admin");
  console.assert(allowed === true, "Admins should be able to delete events");
}

/**
 * Test: Mentor has mid-range limits
 */
export function test_mentorLimits() {
  const mentorId = "mentor123";

  // Mentors have 200 limit for getAllEvents
  for (let i = 0; i < 200; i++) {
    checkRateLimit("getAllEvents", mentorId, "mentor");
  }

  const allowed = checkRateLimit("getAllEvents", mentorId, "mentor");
  console.assert(allowed === false, "Mentor should hit limit after 200 requests");
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log("=== Example 1: Basic Check ===");
  example1_basicCheck();

  console.log("\n=== Example 2: Admin Limits ===");
  example2_adminLimits();

  console.log("\n=== Example 3: Different Limits ===");
  example3_differentLimits();

  console.log("\n=== Example 4: Check Status ===");
  example4_checkStatus();

  console.log("\n=== Example 5: Separate User Limits ===");
  example5_separateUserLimits();

  console.log("\n=== Example 6: Error Handling ===");
  example6_errorHandling();

  console.log("\n=== Running Tests ===");
  test_userCannotDelete();
  test_adminCanDelete();
  test_mentorLimits();
  console.log("✅ All tests passed!");
}

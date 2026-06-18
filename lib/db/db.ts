import {
  checkRateLimit,
  RateLimitExceededError,
} from "../rate_limiting/rateLimiter";
import { UserRole } from "@/BackEnd/type";

/**
 * Helper function to enforce rate limiting
 * Call this at the start of every DB function
 */

export function enforceRateLimit(
  functionName: keyof typeof import("../rate_limiting/rateLimiter").rateLimitConfig,
  userId: string,
  userRole: UserRole = "anonymous",
) {
  if (!checkRateLimit(functionName, userId, userRole)) {
    throw new RateLimitExceededError(functionName, userRole);
  }
}

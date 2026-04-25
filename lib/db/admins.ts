import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { UserData } from "@/BackEnd/type";
import { type UserRole } from "../rate_limiting/rateLimiter";
import { enforceRateLimit } from "./db";

export async function getAllAdmins(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<UserData[]> {
  enforceRateLimit("getAllAdmins", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "users"));
    const admins = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];

    return admins.filter((user) => user.role === "admin") as UserData[];
  } catch (error) {
    console.error("Error fetching all admins:", error);
    throw error;
  }
}

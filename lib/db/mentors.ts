import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import type { Mentor } from "@/BackEnd/type";
import { type UserRole } from "../rate_limiting/rateLimiter";

import { enforceRateLimit } from "./db";

export async function getAllMentors(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<Mentor[]> {
  enforceRateLimit("getAllMentors", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "mentors"));
    return snapshot.docs.map(
      (doc) =>
        ({
          uid: doc.id,
          ...doc.data(),
        }) as Mentor,
    );
  } catch (error) {
    console.error("Error fetching mentors:", error);
    throw error;
  }
}

export async function updateMentor(
  uid: string,
  updates: Partial<Mentor>,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateMentor", userId, userRole);

  try {
    const ref = doc(db, "mentors", uid);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error("Fehler beim Aktualisieren von Mentoren Daten" + error);
    throw error;
  }
}

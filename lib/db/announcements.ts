import { db } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { AnnouncementData } from "@/BackEnd/type";
import { type UserRole } from "../rate_limiting/rateLimiter";
import { enforceRateLimit } from "./db";

export async function getAllAnnouncements(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<AnnouncementData[]> {
  enforceRateLimit("getAllAnnouncements", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "announcements"));
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
      date: doc.data().date.toDate(),
    })) as AnnouncementData[];
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
}

export async function deleteAnnouncement(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("deleteAnnouncement", userId, userRole);

  try {
    const ref = doc(db, "announcements", uid);
    const annSnapshot = await getDoc(ref);

    if (!annSnapshot.exists()) {
      console.log("No announcement to delete");
      return;
    }

    await deleteDoc(ref);
    console.log("Announcement deleted");
  } catch (err) {
    console.log(err);
  }
}

export async function addAnnouncement(
  newAnnouncement: AnnouncementData,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("addAnnouncement", userId, userRole);

  try {
    const dateId = new Date().toISOString();
    await setDoc(doc(db, "announcements", dateId), {
      tag: newAnnouncement.tag,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date(),
      author: newAnnouncement.author,
      readBy: [],
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
}

export async function updateAnnouncement(
  uid: string,
  updates: Partial<AnnouncementData>,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateAnnouncement", userId, userRole);

  try {
    const ref = doc(db, "announcements", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Ankündigung:", err);
    throw err;
  }
}

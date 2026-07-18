import { db } from "../firebase";
import { collection, getDocs, deleteDoc, arrayUnion, doc, query, where } from "firebase/firestore";
import { getDoc, setDoc, updateDoc } from "firebase/firestore";
import type { AnnouncementData, UserRole, UserData } from "@/BackEnd/type";
import { enforceRateLimit } from "./db";
import { sendTriggerEmailToMultipleUsers } from "./emailTriggers";








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
      authorUid: newAnnouncement.authorUid,
      authorName: newAnnouncement.authorName,
      readBy: [],
    });

    const usersSnapshot = await getDocs(collection(db, "users"));
    const allUsers: UserData[] = usersSnapshot.docs
      .map((doc) => doc.data() as UserData)
      .filter((user) => {
        if (newAnnouncement.tag === "user") {
          return ["user", "member", "mentor", "admin"].includes(user.role);
        } else if (newAnnouncement.tag === "member") {
          return ["member", "admin"].includes(user.role);
        } else if (newAnnouncement.tag === "admin") {
          return user.role === "admin";
        }
        return false;
      });

    if (allUsers.length > 0) {
      await sendTriggerEmailToMultipleUsers("announcement", allUsers, {
        announcementTitle: newAnnouncement.title,
        announcementContent: newAnnouncement.content,
      });
    }
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

export async function markAnnouncementAsRead(
  announcementUid: string,
  userId: string,
  userRole: UserRole = "user",
) {
  return updateAnnouncement(
    announcementUid,
    {
      readBy: arrayUnion(userId) as unknown as string[],
    },
    userId,
    userRole,
  );
}

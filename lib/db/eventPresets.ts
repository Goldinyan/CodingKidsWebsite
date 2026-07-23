import { db } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import type { EventDataPreset, UserRole } from "@/BackEnd/type";

export async function getAllEventPresets(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<EventDataPreset[]> {
  try {
    if (userRole !== "admin") return [];

    const snapshot = await getDocs(collection(db, "eventPresets"));
    return snapshot.docs.map(
      (doc) =>
        ({
          presetName: doc.data().presetName ?? doc.data().name,
          name: doc.data().name,
          course: doc.data().course,
          length: doc.data().length,
          memberCount: doc.data().memberCount,
          place: doc.data().place,
          date: doc.data().date,
          requirements: doc.data().requirements,
          description: doc.data().description,
          tags: doc.data().tags,
          difficulty: doc.data().difficulty,
        }) as EventDataPreset,
    );
  } catch (error) {
    console.error("Error fetching all eventPresets:", error);
    throw error;
  }
}

export async function addEventPreset(
  newEventPreset: EventDataPreset,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  try {
    if (userRole !== "admin") return;

    await setDoc(doc(db, "eventPresets", newEventPreset.presetName), {
      name: newEventPreset.name,
      course: newEventPreset.course,
      date: newEventPreset.date.toDate().toISOString(),
      length: newEventPreset.length,
      memberCount: newEventPreset.memberCount,
      place: newEventPreset.place,
      description: newEventPreset.description,
      tags: newEventPreset.tags,
      difficulty: newEventPreset.difficulty,
      requirements: newEventPreset.requirements,
    });
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

export async function deleteEventPreset(
  presetName: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  try {
    if (userRole !== "admin") return;

    const ref = doc(db, "eventPresets", presetName);

    await deleteDoc(ref);
  } catch (error) {
    console.log("Error at deleting Event" + error);
    throw error;
  }
}

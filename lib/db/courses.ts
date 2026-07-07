import { db } from "../firebase";
import {
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import type { CourseData, UserRole } from "@/BackEnd/type";
import { enforceRateLimit } from "./db";

export async function getAllCourses(
  userId: string = "anonymous",
  userRole: UserRole = "user",
): Promise<CourseData[]> {
  enforceRateLimit("getAllCourses", userId, userRole);

  try {
    const snapshot = await getDocs(collection(db, "courses"));
    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    })) as CourseData[];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export async function deleteCourse(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("deleteCourse", userId, userRole);

  try {
    const ref = doc(db, "courses", uid);
    const coursesSnapshot = await getDoc(ref);

    if (!coursesSnapshot.exists()) {
      console.log("No Course to delete");
      return;
    }

    await deleteDoc(ref);
  } catch (err) {
    console.log(err);
  }
}

export async function addCourse(
  newCourse: CourseData,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("addCourse", userId, userRole);

  try {
    await setDoc(doc(db, "courses", newCourse.name), {
      uid: newCourse.name,
      dates: newCourse.dates,
      name: newCourse.name,
      des: newCourse.des,
      tags: newCourse.tags,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}

export async function updateCourse(
  uid: string,
  updates: Partial<CourseData>,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateCourse", userId, userRole);

  try {
    const ref = doc(db, "courses", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.log("Fehler beim deleten von Course", err);
  }
}

export async function deleteEventFromCourse(
  courseId: string,
  eventId: string,
) {
  try {
    const ref = doc(db, "courses", courseId);
    await updateDoc(ref, {
      dates: arrayRemove(eventId),
    });
  } catch (error) {
    console.error("Error deleting event from course:", error);
    throw error;
  }
}

export async function addEventToCourse(
  courseId: string,
  eventId: string,
) {
  try {
    const ref = doc(db, "courses", courseId);
    await updateDoc(ref, {
      dates: arrayUnion(eventId),
    });
  } catch (error) {
    console.error("Error adding event to course:", error);
    throw error;
  }
}

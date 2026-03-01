import { db } from "./firebase";
import { updateProfile } from "firebase/auth";
import {
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import type {
  Mentor,
  EventData,
  UserData,
  AnnouncementData,
  CourseData,
} from "@/BackEnd/type";

// MENTORS

export async function getAllMentors(): Promise<Mentor[]> {
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

export async function updateMentor(uid: string, updates: Partial<Mentor>) {
  try {
    const ref = doc(db, "mentors", uid);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error("Fehler beim Aktualisieren von Mentoren Daten" + error);
    throw error;
  }
}

//Announcements

export async function getAllAnnouncements(): Promise<AnnouncementData[]> {
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

export async function deleteAnnouncement(uid: string) {
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

export async function addAnnouncement(newAnnouncement: AnnouncementData) {
  try {
    const dateId = new Date().toISOString();
    await setDoc(doc(db, "announcements", dateId), {
      tag: newAnnouncement.tag,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      date: new Date(),
      author: newAnnouncement.author,
      readBy: [], // MACH DAS WIEDER ZU redBy: [newAnnouncement.author]  wenn authors die ankuendigungen automatisch als gelesen markiert haben sollen
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    throw error;
  }
}

export async function updateAnnouncement(
  uid: string,
  updates: Partial<AnnouncementData>,
) {
  try {
    const ref = doc(db, "announcements", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Ankündigung:", err);
    throw err;
  }
}

//Courses

// Event Logs

export async function getAllCoureses(): Promise<CourseData[]> {
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

export async function deleteCourse(uid: string) {
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

export async function addCourse(newCourse: CourseData) {
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

export async function updateCourse(uid: string, updates: Partial<CourseData>) {
  try {
    const ref = doc(db, "courses", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.log("Fehler beim deleten von Course", err);
  }
}

export async function deleteEventFromCourse(uid: string) {
  try {
    const course = (await getAllCoureses()).find((c) => c.dates.includes(uid));

    if (course) {
      const ref = doc(db, "courses", course.uid);
      await updateDoc(ref, {
        dates: arrayRemove(uid),
      });
    } else {
      throw new Error("NO COURSE WITH THIS EVENT");
    }
  } catch (error) {
    console.error("Error deleting event from course:", error);
    throw error;
  }
}

export async function addEventFromCourse(courseId: string, eventId: string) {
  try {
    const course = (await getAllCoureses()).find((c) => c.uid === courseId);

    if (course) {
      const ref = doc(db, "courses", course.uid);
      await updateDoc(ref, {
        dates: arrayUnion(eventId),
      });
    } else {
      throw new Error("NO COURSE WITH THIS ID");
    }
  } catch (error) {
    console.error("Error adding event to course:", error);
    throw error;
  }
}

// USERS

export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const snapshot = await getDoc(doc(db, "users", uid));
    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return {
      uid,
      name: data.name ?? "",
      email: data.email ?? "",
      birthdate: data.birthday ?? "",
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
      role: data.role ?? "user",
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UserData[]> {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

export async function updateUser(uid: string, updates: Partial<UserData>) {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    throw error;
  }
}

export async function deleteUserData(uid: string) {
  try {
    const ref = doc(db, "users", uid);
    const userSnapshot = await getDoc(ref);

    if (!userSnapshot.exists()) {
      console.log("No user to delete");
      return;
    }

    await deleteDoc(ref);
    console.log("User deleted");
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(user: User) {
  try {
    if (!user) {
      console.log("No user found");
      return;
    }

    console.log(user.displayName + " got deleted");
    await deleteUserData(user.uid);
    await user.delete();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// EVENTS

export async function getAllEvents() {
  try {
    const snapshot = await getDocs(collection(db, "events"));
    return snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw error;
  }
}

export async function addEvent(newEvent: EventData) {
  try {
    let date: Date;

    if (newEvent.date instanceof Timestamp) {
      date = newEvent.date.toDate();
    } else if (newEvent.date instanceof Date) {
      date = newEvent.date;
    } else {
      // falls es ein String ist (z. B. aus einem <input type="date">)
      date = new Date(newEvent.date);
    }
    const dateId = date.toISOString();
    await setDoc(doc(db, "events", dateId), {
      name: newEvent.name,
      course: newEvent.course,
      date: date.toISOString(),
      length: newEvent.length,
      memberCount: newEvent.memberCount,
      place: newEvent.place,
      typeOfEvent: newEvent.typeOfEvent,
      description: newEvent.description,
      mentors: [],
      users: [],
      queue: [],
    });

    const course = (await getAllCoureses()).find(
      (c) => c.uid === newEvent.course,
    );

    if (course) {
      const updatedDates = [...course.dates, dateId];
      await updateCourse(course.uid, { dates: updatedDates });
    }
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

export async function deleteEvent(uid: string) {
  try {
    const ref = doc(db, "events", uid);
    const eventSnapshot = await getDoc(ref);

    if (!eventSnapshot.exists) {
      console.log("No event to delete");
      return;
    }
    await deleteDoc(ref);
    console.log("Event deleted");

    const course = (await getAllCoureses()).find((c) => c.dates.includes(uid));

    if (course) {
      const updatedDates = [];
    }
  } catch (error) {
    console.log("Error at deleting Event" + error);
  }
}

export async function updateEvent(uid: string, updates: Partial<EventData>) {
  try {
    const ref = doc(db, "events", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.log(err);
  }
}

export async function addUserToEvent(eventId: string, userId: string) {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error("Event not exist");
    }

    const eventData = eventSnapshot.data();

    const currentUsers: string[] = eventData.users || [];

    if (currentUsers.length >= 18) {
      // Event ist voll → User in die Warteschlange
      await updateDoc(eventRef, {
        queue: arrayUnion(userId),
      });

      await updateDoc(eventRef, {
        log: arrayUnion({ date: Date.now(), type: "userJoined", user: userId }),
      });
    } else {
      // Noch Platz dann User direkt hinzufügen
      await updateDoc(eventRef, {
        users: arrayUnion(userId),
      });

      await updateDoc(eventRef, {
        log: arrayUnion({
          date: Date.now(),
          type: "userJoinedQueue",
          user: userId,
        }),
      });
    }
  } catch (error) {
    console.error("Error adding user to event:", error);
    throw error;
  }
}

export async function isUserInEvent(eventId: string, userId: string) {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error("Event does not exist");
    }

    const eventData = eventSnapshot.data();
    const currentUsers: string[] = eventData.users;
    const currentQueue: string[] = eventData.queue;

    if (currentUsers.includes(userId)) {
      return "User";
    }

    if (currentQueue.includes(userId)) {
      return "Queue";
    }

    return "false";
  } catch (error) {
    console.error("Error checking if user in event:", error);
    throw error;
  }
}

export async function removeUserFromEvent(eventId: string, userId: string) {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error("Event not exist");
    }

    const eventData = eventSnapshot.data();
    const currentUsers: string[] = eventData.users;
    const currentQueue: string[] = eventData.queue;

    if (currentUsers.includes(userId)) {
      await updateDoc(eventRef, {
        users: arrayRemove(userId),
      });

      if (currentQueue.length > 0) {
        const nextUser = currentQueue[0];

        await updateDoc(eventRef, {
          users: arrayUnion(nextUser),
          queue: arrayRemove(nextUser),
        });
      }
    }

    if (currentQueue.includes(userId)) {
      await updateDoc(eventRef, {
        queue: arrayRemove(userId),
      });
    }
  } catch (error) {
    console.error("Error removing user from event:", error);
    throw error;
  }
}

// Admins

export async function getAllAdmins(): Promise<UserData[]> {
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

//  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠀⠀⠀⠀⠀
// ⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⡟⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠈⢻⣷⣄⣀⣀⣠⣤⣴⣶⣶⣶⣶⣶⣶⣤⣤⣠⣾⡿⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⣻⣿⣿⣿⠿⠛⠛⠉⠉⠁⠀⠉⠉⠙⢻⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⣀⣾⡿⢿⣿⣇⠀⠀⠚⠀⠀⠀⠀⠀⠀⠀⣼⣿⠟⠿⣿⣿⣦⠀⠀⠀⠀
// ⠀⠀⣴⣿⠟⠁⠀⢿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⡟⠀⠀⠈⣿⣿⣷⡄⠀⠀
// ⠀⣼⣿⠃⠀⠀⠀⠈⣿⣿⠀⠀⠀⠀⠀⠀⠀⢀⣿⡿⠀⠀⠀⠀⠃⢻⣿⣿⡄⠀
// ⢸⣿⡇⠀⠀⠀⠀⠀⠸⣿⣇⠀⠀⠀⠀⠀⠀⣾⡿⠀⠀⠀⠀⠀⠃⠀⢻⣿⣿⡀
// ⣿⣿⡇⠀⠀⠀⠀⠀⠀⢹⣿⠀⠀⠀⠀⠀⣸⣿⠃⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇
// ⢿⣿⡇⠀⠀⠀⠀⠀⠀⠈⣿⡇⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷
// ⠸⣿⣿⡄⠀⠀⠀⠀⠀⠀⢹⣿⠀⠀⠀⣾⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⡇
// ⠀⢻⣿⣿⣄⠀⠀⠀⠀⠀⠘⣿⡇⠀⣴⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⡟⠀
// ⠀⠀⠹⣿⣿⣧⡀⠀⠀⠀⠀⢿⣿⡀⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⠟⠀⠀
// ⠀⠀⠀⠈⢿⣿⣿⣦⣀⠀⠀⢸⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⣤⣾⣿⡿⠋⠀⠀⠀
// ⠀⠀⠀⠀⠀⠋⠻⢿⣿⣷⣤⣸⣿⣿⣿⣇⣀⣀⣀⣤⣶⣿⣿⣿⡿⠁⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢿⠁⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠠⠀⠀⠀⠀⢤⠀⠙⢿⣿⣿⠟⠛⠉⢹⠁⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠃⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
// ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠃⠀⠀⠀⠀⠘⠀⠀⠀⠸⠀⠀⠀⠀⠀⠀⠀

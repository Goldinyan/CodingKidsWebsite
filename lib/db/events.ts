import { db } from "../firebase";
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
import {
  checkRateLimit,
  RateLimitExceededError,
  type UserRole,
} from "../rate_limiting/rateLimiter";
import { enforceRateLimit } from "./db";
import { getAllCourses, updateCourse } from "./courses";

// EVENTS

export async function getAllEvents(
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("getAllEvents", userId, userRole);

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

export async function addEvent(
  newEvent: EventData,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("addEvent", userId, userRole);

  try {
    let date: Date;

    if (newEvent.date instanceof Timestamp) {
      date = newEvent.date.toDate();
    } else if (newEvent.date instanceof Date) {
      date = newEvent.date;
    } else {
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

    const course = (await getAllCourses(userId, userRole)).find(
      (c) => c.uid === newEvent.course,
    );

    if (course) {
      const updatedDates = [...course.dates, dateId];
      await updateCourse(course.uid, { dates: updatedDates }, userId, userRole);
    }
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

export async function deleteEvent(
  uid: string,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("deleteEvent", userId, userRole);

  try {
    const ref = doc(db, "events", uid);
    const eventSnapshot = await getDoc(ref);

    if (!eventSnapshot.exists) {
      console.log("No event to delete");
      return;
    }
    await deleteDoc(ref);
    console.log("Event deleted");

    const course = (await getAllCourses(userId, userRole)).find((c) =>
      c.dates.includes(uid),
    );

    if (course) {
      const courseRef = doc(db, "courses", course.uid);
      await updateDoc(courseRef, {
        dates: arrayRemove(uid),
      });
    }
  } catch (error) {
    console.log("Error at deleting Event" + error);
    throw error;
  }
}

export async function updateEvent(
  uid: string,
  updates: Partial<EventData>,
  userId: string = "anonymous",
  userRole: UserRole = "user",
) {
  enforceRateLimit("updateEvent", userId, userRole);

  try {
    const ref = doc(db, "events", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.log(err);
  }
}

export async function addUserToEvent(
  eventId: string,
  userId: string,
  requesterId: string = "anonymous",
  requesterRole: UserRole = "user",
) {
  enforceRateLimit("addUserToEvent", requesterId, requesterRole);

  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error("Event not exist");
    }

    const eventData = eventSnapshot.data();

    const currentUsers: string[] = eventData.users || [];

    if (currentUsers.length >= 18) {
      await updateDoc(eventRef, {
        queue: arrayUnion(userId),
      });

      await updateDoc(eventRef, {
        log: arrayUnion({ date: Date.now(), type: "userJoined", user: userId }),
      });
    } else {
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

export async function isUserInEvent(
  eventId: string,
  userId: string,
  requesterId: string = "anonymous",
  requesterRole: UserRole = "user",
) {
  enforceRateLimit("isUserInEvent", requesterId, requesterRole);

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

export async function removeUserFromEvent(
  eventId: string,
  userId: string,
  requesterId: string = "anonymous",
  requesterRole: UserRole = "user",
) {
  enforceRateLimit("removeUserFromEvent", requesterId, requesterRole);

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

import { db } from "../firebase";
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
import {
  EventData,
  EventStatus,
  type Log,
} from "@/BackEnd/type";
import type { UserRole } from "@/BackEnd/type";
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

    if ((newEvent.date as any) instanceof Timestamp) {
      date = (newEvent.date as unknown as Timestamp).toDate();
    } else if ((newEvent.date as any) instanceof Date) {
      date = newEvent.date as unknown as Date;
    } else {
      date = new Date(newEvent.date as unknown as string);
    }
    const dateId = date.toISOString();

    const initialLog: Log = {
      type: "eventChanged",
      date: Timestamp.now(),
      mentor: userId,
      reason: "Event erstellt",
      updates: {
        name: newEvent.name,
        course: newEvent.course,
        date: newEvent.date,
      },
    };

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
      logs: [initialLog],
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

    // Log deletion before deleting
    const deleteLog: Log = {
      type: "eventDeleted",
      date: Timestamp.now(),
      user: userId,
    };

    await updateDoc(ref, {
      logs: arrayUnion(deleteLog),
    });

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

    // Create update log
    const updateLog: Log = {
      type: "eventChanged",
      date: Timestamp.now(),
      mentor: userId,
      reason: "Event aktualisiert",
      updates: updates,
    };

    // Remove logs from updates to prevent circular updates
    const { logs, ...updatesWithoutLogs } = updates;

    await updateDoc(ref, {
      ...updatesWithoutLogs,
      logs: arrayUnion(updateLog),
    });
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

    if (currentUsers.length >= eventData.memberCount) {
      const log: Log = {
        type: "userJoinedQueue",
        date: Timestamp.now(),
        user: userId,
      };

      await updateDoc(eventRef, {
        queue: arrayUnion(userId),
        logs: arrayUnion(log),
      });
    } else {
      const log: Log = {
        type: "userJoined",
        date: Timestamp.now(),
        user: userId,
      };

      await updateDoc(eventRef, {
        users: arrayUnion(userId),
        logs: arrayUnion(log),
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
  requesterRole: UserRole,
): Promise<EventStatus> {
  enforceRateLimit("isUserInEvent", userId, requesterRole);

  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventRef);

    if (!eventSnapshot.exists()) {
      console.error("Event does not exist");
      return EventStatus.Error;
    }

    const eventData = eventSnapshot.data();
    const currentUsers: string[] = eventData.users;
    const currentQueue: string[] = eventData.queue;

    if (currentUsers.includes(userId)) {
      return EventStatus.User;
    }

    if (currentQueue.includes(userId)) {
      return EventStatus.Queue;
    }

    return EventStatus.NotRegistered;
  } catch (error) {
    console.error("Error checking if user in event:", error);
    return EventStatus.Error;
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
      const log: Log = {
        type: "userLeft",
        date: Timestamp.now(),
        user: userId,
        reason: "Benutzer wurde entfernt",
      };

      await updateDoc(eventRef, {
        users: arrayRemove(userId),
        logs: arrayUnion(log),
      });

      if (currentQueue.length > 0) {
        const nextUser = currentQueue[0];

        const moveLog: Log = {
          type: "userJoined",
          date: Timestamp.now(),
          user: nextUser,
        };

        await updateDoc(eventRef, {
          users: arrayUnion(nextUser),
          queue: arrayRemove(nextUser),
          logs: arrayUnion(moveLog),
        });
      }
    }

    if (currentQueue.includes(userId)) {
      const log: Log = {
        type: "userLeftQueue",
        date: Timestamp.now(),
        user: userId,
        reason: "Von Warteschlange entfernt",
      };

      await updateDoc(eventRef, {
        queue: arrayRemove(userId),
        logs: arrayUnion(log),
      });
    }
  } catch (error) {
    console.error("Error removing user from event:", error);
    throw error;
  }
}

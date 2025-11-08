import { db } from "./firebase";
import { updateProfile } from "firebase/auth";
import { arrayRemove, collection, getDocs, deleteDoc} from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "firebase/auth";
import type { Mentor, EventData, UserData} from "@/BackEnd/type"




// MENTORS

export async function getAllMentors(): Promise<Mentor[]>{
  const snapshot = await getDocs(collection(db, "mentors"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }) as Mentor);
}

export async function updateMentor(uid: string, updates: Partial<Mentor>) {
  try {
    const ref = doc(db, "mentors", uid);
    await updateDoc(ref, updates)
  } catch(error) {
    console.error("Fehler beim Aktualisieren von Mentoren Daten" + error)
    throw error;
  }
}

// USERS

export async function getUserData(uid: string): Promise<UserData | null> {
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
}

export async function getAllUsers(): Promise<UserData[]> {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as UserData[];
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

export async function deleteUserData(uid: string){
  
  try {
    const ref = doc(db, "users", uid)
    const userSnapshot = await getDoc(ref)

    if(!userSnapshot.exists()){
      console.log("No user to delete")
      return;
    }

    await deleteDoc(ref)
    console.log("User deleted")
  } catch(err){
    console.log(err)
  }
}

export async function deleteUser(user: User){
  
  
  if(!user){
    console.log("No user found")
    return;
  }

  console.log(user.displayName + " got deleted")
  await deleteUserData(user.uid)
  await user.delete()
}

// EVENTS

export async function getAllEvents() {
  const snapshot = await getDocs(collection(db, "events"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
}

export async function addEvent(
  newEvent: EventData
) {
  const date = typeof newEvent.date === "string" ? new Date(newEvent.date) : (newEvent.date as Date);
  const dateId = date.toISOString();
  await setDoc(doc(db, "events", dateId), {
    name: newEvent.name,
    date: date.toISOString(),
    length: newEvent.length,
    memberCount: newEvent.memberCount,
    place: newEvent.place,
    typeOfEvent: newEvent.typeOfEvent,
    description: newEvent.description,
    users: [],
    queue: [],
  });
}

export async function deleteEvent(uid: string){

  try {
    const ref = doc(db, "events", uid)
    const eventSnapshot = await getDoc(ref)

    if(!eventSnapshot.exists){
      console.log("No event to delete")
      return;
    }
    await deleteDoc(ref)
    console.log("Event deleted")

  } catch(error){
    console.log("Error at deleting Event" + error)
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
  } else {
    // Noch Platz → User direkt hinzufügen
    await updateDoc(eventRef, {
      users: arrayUnion(userId),
    });
  }
}

export async function isUserInEvent(eventId: string, userId: string) {

  
  const eventRef = doc(db, "events", eventId);
  const eventSnapshot = await getDoc(eventRef);

  if (!eventSnapshot.exists()) {
    throw new Error("Event not exist");
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
}

export async function removeUserFromEvent(eventId: string, userId: string) {
  

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
}

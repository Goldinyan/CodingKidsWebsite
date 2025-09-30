import { db, user } from "./firebase";
import { updateProfile } from "firebase/auth";
import { arrayRemove, collection, getDocs, deleteDoc} from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";


export type typeOfEvent = "Class" | "MemberOnly" | "Other";

export type typeOfPlaces = "x" | "y" | "z";

type EventData = {
  name: string;
  date: Date;
  length: number;
  memberCount: number;
  place: typeOfPlaces;
  typeOfEvent: typeOfEvent;
};

type UserData = {
  name: string;
  email: string;
  birthday: string; // ISO-String
  createdAt: Date;
  role: string;
};



// USERS

export async function getUserData(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
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
  if(!user){
    console.log("NO USER LOGGED IN");
  }
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

export async function deleteUser(){
  if(!user){
    console.log("no user logged in")
    return;
  }
  console.log(user.displayName + "got deleted")
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
  name: string,
  date: Date,
  length: number,
  memberCount: number,
  place: typeOfPlaces,
  typeOfEvent: typeOfEvent
) {
  const dateId = date.toISOString();
  await setDoc(doc(db, "events", dateId), {
    name: name,
    date: date.toISOString(),
    length: length,
    memberCount: memberCount,
    place: place,
    typeOfEvent: typeOfEvent,
    users: [],
    queue: [],
  });
}

export async function updateEvent(uid: string, updates: Partial<EventData>) {
  try {
    const ref = doc(db, "events", uid);
    await updateDoc(ref, updates);
  } catch (err) {
    console.log(err);
  }
}

export async function addUserToEvent(eventId: string) {
  if (!user) {
    throw new Error("no user logged in");
  }

  const userId = user.uid;
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

export async function isUserInEvent(eventId: string) {
  if (!user) {
    throw new Error("no user logged in");
  }
  const userId = user.uid;
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

export async function removeUserFromEvent(eventId: string) {
  if (!user) {
    throw new Error("no user logged in");
  }

  const userId = user.uid;
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

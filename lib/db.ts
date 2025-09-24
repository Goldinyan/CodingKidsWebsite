import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore"


export async function getUserData(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  return snapshot.data();
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "users"))
  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data(),
  }))
}
type UserData = {
  name: string;
  email: string;
  birthday: string; // ISO-String
  createdAt: Date;
  role: string;
};

export async function updateUser(uid: string, updates: Partial<UserData>) {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, updates);
  } catch (error) {
    console.error("Fehler beim Aktualisieren:", error);
    throw error;
  }
}

"use client"

// lib/auth.ts
import { auth, db, user } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";




export async function registerUser(email: string, password: string, extraData: {
  name: string;
  birthdate: Date;
}) {
  await setPersistence(auth, browserLocalPersistence)
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    name: extraData.name,
    birthdate: extraData.birthdate.toISOString(),
    createdAt: new Date().toISOString(),
    role: "N/A"
  });


  return user;
}





export async function loginUser(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence)
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}




export async function logoutUser() {
  await signOut(auth);
}



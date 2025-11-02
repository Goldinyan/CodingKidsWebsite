"use client";

// lib/auth.ts
import { auth, db, } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function registerUser(
  email: string,
  password: string,
  extraData: {
    name: string;
    birthdate: Date;
    courses?: string[];
  }
) {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  await emailVerification(user);
  console.log("Verifizierung gesendet")

  // User verified kann man checken mit user?.emailVerified und so dann sacehn freischalten oder eben nicht 
  await updateProfile(user, {
    displayName: extraData.name,
  });
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    name: extraData.name,
    birthdate: extraData.birthdate.toISOString(),
    createdAt: new Date().toISOString(),
    role: "N/A",
    courses: extraData.courses || [],
  });

  return user;
}

export async function emailVerification(user: User){
  try {
    await sendEmailVerification(user);
  } catch(error){
    console.log(error);
  }
}

export async function loginUser(email: string, password: string) {
  await setPersistence(auth, browserLocalPersistence);
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function passwordReset(email: string){
  try {
    await sendPasswordResetEmail(auth, email);
  } catch(error){
    console.log(error);
  }
}

export async function changeEmail(newEmail: string) {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateEmail(user, newEmail);
      console.log("E-Mail geändert");
    } catch (error) {
      console.error("Fehler beim Ändern der E-Mail:", error);
    }
  } else {
    console.log("User is null");
  }
}

export async function reAuthenticate(email: string, password: string) {
  const user = auth.currentUser;

  if (user) {
    const credential = EmailAuthProvider.credential(email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      console.log("Reauthentication erfolgreich");
    } catch (error) {
      console.error("Fehler bei Reauthentication:", error);
    }
  } else {
    console.log("Kein angemeldeter Nutzer");
  }
}

export async function logoutUser() {
  await signOut(auth);
}

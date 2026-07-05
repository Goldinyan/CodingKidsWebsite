// lib/auth.ts
"use client";

import {
  sendAccountCreationEmailToAdmin,
  sendWelcomeEmail,
} from "@/BackEnd/email";
import { auth, db } from "./firebase";
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
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  browserSessionPersistence,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { UserData } from "@/BackEnd/type";
import { toJsDate } from "@/BackEnd/utils";

export async function registerUser(
  email: string,
  password: string,
  extraData: {
    name: string;
    birthdate: Date;
    courses?: string[];
  },
) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    await emailVerification(user);
    await sendWelcomeEmail(email, extraData.name);
    await sendAccountCreationEmailToAdmin(extraData.name, email);
    console.log("Verifizierung gesendet");

    // User verified kann man checken mit user?.emailVerified und so dann sacehn freischalten oder eben nicht
    await updateProfile(user, {
      displayName: extraData.name,
    });

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name: extraData.name,
      birthdate: Timestamp.fromDate(
        toJsDate(extraData.birthdate.toISOString()),
      ),
      createdAt: Timestamp.fromDate(new Date()),
      role: "user",
      courses: extraData.courses || [],
      projects: [],
      settings: {
        theme: "light",
        isRounded: true,
        notifications: {
          newEvent: true,
          kicked: true,
          queueToUser: true,
        },
      },
    };
    await setDoc(doc(db, "users", user.uid), { userData });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function emailVerification(user: User) {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.log(error);
  }
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  try {
    const persistenceType = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(auth, persistenceType);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function passwordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.log(error);
  }
}

export async function changeEmail(newEmail: string) {
  const user = auth.currentUser;
  if (user) {
    try {
      await updateEmail(user, newEmail);
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

export async function changePassword(newPassword: string) {
  const user = auth.currentUser;
  if (user) {
    try {
      await updatePassword(user, newPassword);
      console.log("Passwort geändert");
    } catch (error) {
      console.error("Fehler beim Ändern des Passworts:", error);
      throw error;
    }
  } else {
    console.log("User is null");
  }
}

export async function logOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
}

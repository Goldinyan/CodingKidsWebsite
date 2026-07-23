import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: "codingkidswebsite.firebaseapp.com",
  projectId: "codingkidswebsite",
  storageBucket: "codingkidswebsite.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore mit nativem Offline-Cache initialisieren
// Was ändert sich dadurch für deine App?
// neu laden -> liest getDocs oder getDoc() die Daten blitzschnell aus dem lokalen Browser-Speicher
// liegt im geschützten Browser-Speicher der Domain und wird nicht in leicht auslesbaren Dateien abgelegt

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const storage = getStorage(app);

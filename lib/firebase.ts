
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,  
  authDomain: "codingkidswebsite.firebaseapp.com",
  projectId: "codingkidswebsite",
  storageBucket: "codingkidswebsite.firebasestorage.app",
  messagingSenderId: "791381184779",
  appId: "1:791381184779:web:0287aa6438367e678ed20e",
  measurementId: "G-4E35G7Y9CE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const user = auth.currentUser;



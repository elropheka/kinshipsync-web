import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions'; // Import getFunctions

const firebaseConfig = {
  apiKey: "AIzaSyCyU0cQOiB7JsDZGJKW7XRp131jDEu2Ykk",
  authDomain: "kinshipsync-f2896.firebaseapp.com",
  projectId: "kinshipsync-f2896",
  storageBucket: "kinshipsync-f2896.firebasestorage.app",
  messagingSenderId: "433750501084",
  appId: "1:433750501084:web:f455e16d4215671200b619",
  measurementId: "G-483SJB1DHJ"
};

// Initialize Firebase
// To prevent re-initialization errors in HMR environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app); // Initialize functions

export { app, auth, firestore, storage, functions }; // Export functions

// Import SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "auth-679d1.firebaseapp.com",
  projectId: "auth-679d1",
  storageBucket: "auth-679d1.firebasestorage.app",
  messagingSenderId: "666945269996",
  appId: "1:666945269996:web:359c4ec0ab24a0e45575c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

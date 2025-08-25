import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDk89URaRhCWdQJQrSLN0OquN2Q4HVFpZE",
  authDomain: "happy-days-95eb0.firebaseapp.com",
  projectId: "happy-days-95eb0",
  storageBucket: "happy-days-95eb0.firebasestorage.app",
  messagingSenderId: "961707441271",
  appId: "1:961707441271:web:56290685101ca819519a72",
  measurementId: "G-M2FCKPP6X2",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// egyszerű Google bejelentkezés
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Sign-in error:", error);
    return null;
  }
};

export const postsCollection = collection(db, "posts");

export const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));

export const addPost = async (
  userId: string,
  content: string,
  shared: boolean
) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      userId,
      content,
      shared,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding post:", error);
    throw error;
  }
};

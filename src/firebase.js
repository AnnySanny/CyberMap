import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAYC7TdfZPIjJWoDax2kYTP9bsFuthYeL0",
  authDomain: "beautybook-d2962.firebaseapp.com",
  projectId: "beautybook-d2962",
  storageBucket: "beautybook-d2962.firebasestorage.app",
  messagingSenderId: "470807338849",
  appId: "1:470807338849:web:79d3296a2836c8446e2f20"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
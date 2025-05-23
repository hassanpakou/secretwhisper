import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5-MTcRQVIQlHey893VAjIYeRNXE9yJU8",
  authDomain: "secretwhisper-1f6a3.firebaseapp.com",
  projectId: "secretwhisper-1f6a3",
  storageBucket: "secretwhisper-1f6a3.firebasestorage.app",
  messagingSenderId: "730919242443",
  appId: "1:730919242443:web:78b021be0a067f480a694e",
  measurementId: "G-T00F9DESRP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
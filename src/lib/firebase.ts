import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIYveIUD4coWS7aRHgfYVwZqNQVWVnad4",
  authDomain: "roleplay-20743.firebaseapp.com",
  projectId: "roleplay-20743",
  storageBucket: "roleplay-20743.firebasestorage.app",
  messagingSenderId: "1036877672999",
  appId: "1:1036877672999:web:b121210260cd0190f49402"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

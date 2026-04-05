import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqXpY8z0uPZd6Ci1EBuoB8iHCSzQJ4IbE",
  authDomain: "wehavefoodathome-9edec.firebaseapp.com",
  projectId: "wehavefoodathome-9edec",
  storageBucket: "wehavefoodathome-9edec.firebasestorage.app",
  messagingSenderId: "998581500871",
  appId: "1:998581500871:web:2d6054bec3c3011e7b37e2",
  measurementId: "G-JCZR8300CQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

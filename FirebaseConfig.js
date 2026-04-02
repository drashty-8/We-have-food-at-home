// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqXpY8z0uPZd6Ci1EBuoB8iHCSzQJ4IbE",
  authDomain: "wehavefoodathome-9edec.firebaseapp.com",
  projectId: "wehavefoodathome-9edec",
  storageBucket: "wehavefoodathome-9edec.firebasestorage.app",
  messagingSenderId: "998581500871",
  appId: "1:998581500871:web:2d6054bec3c3011e7b37e2",
  measurementId: "G-JCZR8300CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKMJ_Arjbt6YBD8j_NYFNrRf0Toul2Tak",
  authDomain: "we-have-food-at-home-8eeae.firebaseapp.com",
  projectId: "we-have-food-at-home-8eeae",
  storageBucket: "we-have-food-at-home-8eeae.firebasestorage.app",
  messagingSenderId: "950010104423",
  appId: "1:950010104423:web:afb5aefe560bf49a16e2c2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

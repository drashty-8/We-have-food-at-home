import { auth, db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const loadPantry = async(uid) => {
    //point to document
    const docRef = doc(db, "users", uid);
    //read document
    const docSnap = await getDoc(docRef); //await waits to get docref
    //if doc exists, return pantry chips
    if(docSnap.exists()) {
        return docSnap.data().pantry; //returns info from saved pantry
    } else {
        return []; //returns nothing if pantry empty
    }
}
export const savePantry = async(uid, chips) => {
    const docRef = doc(db, "users", uid);
    await setDoc(docRef, { pantry: chips }, { merge: true });
}

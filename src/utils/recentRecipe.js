import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const loadRecentRecipes = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().recentRecipes || [];
  }

  return [];
};

export const saveRecentRecipes = async (uid, recipes) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, { recentRecipes: recipes }, { merge: true });
};
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/*
 * loadRecentRecipes(uid)
 *
 * Retrieves the user's recently viewed recipes from Firestore.
 *
 * Firestore document structure:
 * users/{uid}
 *   └── recentRecipes: [ ... ]
 *
 * Parameters:
 * - uid: Firebase Authentication user ID
 *
 * Returns:
 * - An array of recently viewed recipes
 * - An empty array if the document does not exist
 *   or if recentRecipes has not been created yet
 */

export const loadRecentRecipes = async (uid) => {
    // Reference to the user's document
  const docRef = doc(db, "users", uid);

  // Read the document from Firestore
  const docSnap = await getDoc(docRef);

  // If the document exists, return recentRecipes
  if (docSnap.exists()) {
    return docSnap.data().recentRecipes || [];
  }

  // Otherwise return an empty array
  return [];
};

export const saveRecentRecipes = async (uid, recipes) => {
    // Reference to the user's document
  const docRef = doc(db, "users", uid);

  // Save recentRecipes while keeping existing fields
  await setDoc(
    docRef, 
    { recentRecipes: recipes }, 
    { merge: true }
    );
};
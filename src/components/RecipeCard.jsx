import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import "../css/RecipeCard.css";

function RecipeCard({ recipe, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", recipe.id.toString());
    
    const unsubscribe = onSnapshot(favRef, (docSnap) => {
      setIsFavorite(docSnap.exists());
    });

    return () => unsubscribe();
  }, [recipe.id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation(); 
    
    if (!auth.currentUser) {
      alert("Please log in to save favorites!");
      return;
    }

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", recipe.id.toString());

    try {
      if (isFavorite) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          addedAt: new Date()
        });
      }
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  return (
    <div className="recipe-card" onClick={onClick}>
      <button 
        className={`heart-btn ${isFavorite ? "active" : ""}`} 
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <img className="recipe-img" src={recipe.image} alt={recipe.title} />
      <p className="recipe-title">{recipe.title}</p>
    </div>
  );
}

export default RecipeCard;

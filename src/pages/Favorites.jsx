import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "../components/RecipeDetails";
import "../css/Favorites.css";

function Favorites() {
  
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const favsRef = collection(db, "users", user.uid, "favorites");
        const q = query(favsRef);

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const recipes = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setFavoriteRecipes(recipes);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) return <div className="fav-msg">Loading...</div>;
  if (!auth.currentUser) return <div className="fav-msg">Please log in to see favorites.</div>;

  if (selectedRecipeId) {
    return (
      <RecipeDetails 
        recipeId={selectedRecipeId} 
        onBack={() => setSelectedRecipeId(null)} 
      />
    );
  }

  return (
    <div className="favorites-container" style={{ padding: "20px" }}>
      <h1 style={{ color: "#588157", textAlign: "center" }}>Your Saved Recipes</h1>
      
      {favoriteRecipes.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No favorites yet! Go to the home page and click some ❤️ icons.
        </p>
      ) : (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onClick={() => setSelectedRecipeId(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

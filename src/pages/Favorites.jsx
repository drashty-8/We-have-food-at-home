import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "../components/RecipeDetails";
import "../css/favorites.css";

function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="favorites-container">
      <h1 className="page-header">Your Saved Recipes</h1>

      {favoriteRecipes.length === 0 ? (
        <p className="empty-msg">
          No favorites yet! Go to the home page and click some ❤️ icons.
        </p>
      ) : (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

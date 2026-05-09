import { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { loadRecentRecipes, saveRecentRecipes } from "../utils/recentRecipe";
import RecipeCard from "../components/RecipeCard";
import RecipeDetails from "../components/RecipeDetails";
import "../css/favorites.css";

function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const recent = await loadRecentRecipes(user.uid);
        setRecentRecipes(recent);

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
        setFavoriteRecipes([]);
        setRecentRecipes([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


  const addToRecent = (recipe) => {
    const user = auth.currentUser;
    if (!user || !recipe) return;

    setRecentRecipes((prev) => {
      const updated = [
        recipe,
        ...prev.filter(
          (r) => r.id !== recipe.id && r.title !== recipe.title),
      ].slice(0, 7);

      saveRecentRecipes(user.uid, updated);
      return updated;
    });
  };

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
              onClick={() => {
                addToRecent(recipe);
                setSelectedRecipe(recipe);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;

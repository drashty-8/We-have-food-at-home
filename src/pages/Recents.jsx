import "../css/Recents.css";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { loadRecentRecipes } from "../utils/recentRecipe";
import RecipeDetails from "../components/RecipeDetails";

function Recents() {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const recent = await loadRecentRecipes(user.uid);
        setRecentRecipes(recent);
      } else {
        setRecentRecipes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <div className="recents-page">
      <h2>Recently Viewed</h2>

      {recentRecipes.length === 0 ? (
        <p>Recently viewed recipes will appear here.</p>
      ) : (
        <div className="recents-row">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recent-card"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img src={recipe.image} alt={recipe.title} />
              <p>{recipe.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recents;
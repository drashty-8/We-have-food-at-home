import "../css/Recents.css";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { loadRecentRecipes } from "../utils/recentRecipe";
import RecipeDetails from "../components/RecipeDetails";

/*
 * Recents Page
 *
 * Displays all recipes the user has recently viewed.
 * Recipes are loaded from Firebase under:
 * users/{uid}/recentRecipes
 *
 * Features:
 * - Loads recent recipes when the page opens
 * - Shows a message if there are no recent recipes
 * - Displays recipe cards in a horizontal scrolling row
 * - Opens RecipeDetails when a recipe is clicked
 * - Hides "(missing)" ingredient tags when viewing from this page
 */

function Recents() {
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Load recently viewed recipes from Firestore
        const recent = await loadRecentRecipes(user.uid);
        setRecentRecipes(recent);
      } else {
        // Clear data if the user is not logged in
        setRecentRecipes([]);
      }
    });

    return () => unsubscribe();
  }, []);

   /*
   * If a recipe is selected, show the detailed recipe page.
   * hideMissing={true} prevents "(missing)" labels
   * from appearing on the Recents page.
   */
  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        hideMissing={true}
      />
    );
  }

  /*
   * Main page display.
   * Shows a title and either:
   * - A message if no recent recipes exist
   * - A horizontal row of recipe cards
   */
  return (
    <div className="recents-page">
      <h1 className="page-header">Recently Viewed</h1>

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
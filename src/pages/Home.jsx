import Recipes from "../components/Recipes";
import RecipeDetails from "../components/RecipeDetails";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { chips, preferences } = useOutletContext();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // has a user clicked search?\
  const [prefsApplied, setPrefsApplied] = useState(false); // have saved prefs been applied yet? only once
  const [filters, setFilters] = useState({
    cuisine: [],
    excludeCuisine: [],
    diet: [],
    intolerances: [],
  });
  
  // Apply saved preferences to filters once, and only when they first arrive
  useEffect(() => {
    if (prefsApplied) return;
    if (!preferences) return;

    setFilters((prev) => ({
      ...prev,
      diet: preferences.diet || [],
      intolerances: preferences.intolerances || [],
    }));

    setPrefsApplied(true);
  }, [preferences, prefsApplied])

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

  return (
    <Recipes
      chips={chips}
      filters={filters}
      setFilters={setFilters}
      onSelectRecipe={setSelectedRecipe}
      recipes={recipes}
      setRecipes={setRecipes}
      hasSearched={hasSearched}
      setHasSearched={setHasSearched}
    />
  );
}

export default Home;
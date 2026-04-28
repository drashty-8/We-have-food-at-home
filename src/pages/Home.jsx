import Recipes from "../components/Recipes";
import RecipeDetails from "../components/RecipeDetails";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

function Home() {
  const { chips } = useOutletContext();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // has a user clicked search?
  const [filters, setFilters] = useState({
    cuisine: [],
    excludeCuisine: [],
    diet: [],
    intolerances: [],
  });

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
      onSelectedRecipe={setSelectedRecipe}
      recipes={recipes}
      setRecipes={setRecipes}
      hasSearched={hasSearched}
      setHasSearched={setHasSearched}
    />
  );
}

export default Home;
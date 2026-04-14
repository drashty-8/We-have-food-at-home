import RecipeCard from "./RecipeCard";
import "../css/Recipes.css";
import { useState } from "react";
import { searchRecipesByIngredients } from "../utils/api";

function Recipes({ chips, filters, onSelectRecipe }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // differentiates whether a blank screen is no recipes, or not yet searched

  const handleSearch = async () => {
    if (!chips.length) return;

    setLoading(true);
    setError(null);

    try {
      const ingredientNames = chips.map((chip) => {
        return chip.name
      });
      const results = await searchRecipesByIngredients(ingredientNames, filters, 12);
      setRecipes(results);
      setHasSearched(true);
    } catch (err) {
      console.error("Recipe search error:", err);
      setError(err.message || "Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipes">
      <div className="recipe-filters">
        <button
          type="button"
          className="specify-ingredients-button"
          onClick={``}
          disabled={loading || !chips.length}
        >
          Specify Ingredients
        </button>

        <button 
          type="button"
          className="filter-button"
          onClick={``}
          disabled={loading}
        >
          Filters
        </button>

        <button
          type="button"
          className="search-button"
          onClick={handleSearch}
          disabled={loading || !chips.length}  // prevent clicking the search button
        >
          {loading ? "Searching..." : "Search Recipes"}
        </button>
      </div>

      {error && <p className="recipes-error">{error}</p>}

      {/* If there are no results from the search, display messsage */}
      {!error && hasSearched && recipes.length === 0 && (
        <p>No recipes found. Try adding more ingredients.</p>
      )}

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelectRecipe(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;

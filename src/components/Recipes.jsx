import RecipeCard from "./RecipeCard";
import "../css/Recipes.css";
import { useState } from "react";
import { searchRecipesByIngredients } from "../utils/api";

function Recipes({ chips, filters, setFilters, onSelectRecipe, recipes, setRecipes, hasSearched, setHasSearched }) {
  // const [recipes, setRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [hasSearched, setHasSearched] = useState(false); // differentiates whether a blank screen is no recipes, or not yet searched

  const cuisines = [
    "african", "asian", "american", "british", "cajun", "caribbean", "chinese",
    "eastern european", "european", "french", "german", "greek", "indian",
    "irish", "italian", "japanese", "jewish", "korean", "latin american",
    "mediterranean", "mexican", "middle eastern", "nordic", "southern",
    "spanish", "thai", "vietnamese"
  ];

  const diets = [
    "gluten free", "ketogenic", "vegetarian", "lacto-vegetarian",
    "ovo-vegetarian", "vegan", "pescetarian", "paleo", "primal", "low fodmap",
    "whole30"
  ];

  const intolerances = [
    "dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame",
    "shellfish", "soy", "sulfite", "tree nut", "wheat"
  ];

  const handleSearch = async () => {
    if (!chips.length) return;

    setLoading(true);
    setError(null);

    try {
      const ingredientNames = chips.map((chip) => {
        return chip.name
      });
      const results = await searchRecipesByIngredients(ingredientNames, filters, 40);
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
          className="filter-button"
          onClick={() => setShowFilters((prev) => !(prev))}
          disabled={loading}
        >
          {showFilters ? "Filters ▲" : "Filters ▼"}
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

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <p>Cuisine</p>
            <div className="checkbox-grid">
              {cuisines.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={filters.cuisine.includes(item)}
                    onChange={(event) => {
                      const updated = event.target.checked
                        ? [...filters.cuisine, item]
                        : filters.cuisine.filter((i) => i !== item);
                      setFilters((prev) => ({ ...prev, cuisine: updated }));
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>


          <div className="filter-group">
            <p>Exclude Cuisine</p>
            <div className="checkbox-grid">
              {cuisines.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={filters.excludeCuisine.includes(item)}
                    onChange={(event) => {
                      const updated = event.target.checked
                        ? [...filters.excludeCuisine, item]
                        : filters.excludeCuisine.filter((i) => i !== item);
                      setFilters((prev) => ({ ...prev, excludeCuisine: updated }));
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>


          <div className="filter-group">
            <p>Diets</p>
            <div className="checkbox-grid">
              {diets.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={filters.diet.includes(item)}
                    onChange={(event) => {
                      const updated = event.target.checked
                        ? [...filters.diet, item]
                        : filters.diet.filter((i) => i !== item);
                      setFilters((prev) => ({ ...prev, diet: updated }));
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>


          <div className="filter-group">
            <p>Intolerances</p>
            <div className="checkbox-grid">
              {intolerances.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={filters.intolerances.includes(item)}
                    onChange={(event) => {
                      const updated = event.target.checked
                        ? [...filters.intolerances, item]
                        : filters.intolerances.filter((i) => i !== item);
                      setFilters((prev) => ({ ...prev, intolerances: updated }));
                    }}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

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
            onClick={() => onSelectRecipe(recipe)}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;

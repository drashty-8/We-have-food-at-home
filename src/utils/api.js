const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

/**
 * Generic fetch wrapper with error handling for Spoonacular API.
 * Returns the parsed JSON on success, or throws with a descriptive message.
 */
async function spoonFetch(endpoint, params = {}) {
  // Build the URL.
  params.apiKey = API_KEY;
  const queryString = new URLSearchParams(params);
  const url = `${BASE_URL}${endpoint}?${queryString}`;

  // Fetch response.
  const response = await fetch(url);

  // Handle any errors.
  if (!response.ok) {
    if (response.status === 402) {
      throw new Error("Spoonacular daily quota reached. Try again tomorrow.");
    }
    throw new Error(`Spoonacular API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Autocomplete ingredient names.
 * Returns an array of { name, image, id, aisle } objects.
 */
export async function fetchIngredientSuggestions(query, number = 5) {
  // Return nothing if query is empty.
  const trimmed = query.trim();
  if (!trimmed) return [];

  return spoonFetch("/food/ingredients/autocomplete", {
    query: trimmed,
    number,
  });
}

/**
 * Search recipes by a list of ingredient names.
 * Returns an array of recipe summary objects.
 */
export async function searchRecipesByIngredients(ingredientNames, filters, number = 6) {
  // Return empty if pantry is empty.
  if (!ingredientNames.length) return [];

  const formatted = ingredientNames.join(",");

  const params = {
    includeIngredients: formatted,
    sort: "max-used-ingredients",
    number,
  };

  // Handle filtesr.
  if (filters.cuisine) params.cuisine = filters.cuisine.join(",");
  if (filters.excludeCuisine) params.excludeCuisine = filters.excludeCuisine.join(",");
  if (filters.diet) params.diet = filters.diet.join(",");
  if (filters.intolerances) params.intolerances = filters.intolerances.join(",");
  console.log(params.intolerances);

  const data = await spoonFetch("/recipes/complexSearch", params);

  console.log(params);

  // Technically not correct, but works.
  // Should probably be return data.results ?? [];
  if (data.results) {
    return data.results;
  } else {
    return [];
  }
}

/**
 * Get full details for a single recipe (ingredients, nutrition, etc.).
 * Returns the full recipe object.
 */
export async function fetchRecipeDetails(recipeId) {
  return spoonFetch(`/recipes/${recipeId}/information`, {
    includeNutrition: true,
  });
}

/**
 * Get analyzed cooking instructions for a recipe.
 * Returns an array of instruction step groups.
 */
export async function fetchRecipeSteps(recipeId) {
  return spoonFetch(`/recipes/${recipeId}/analyzedInstructions`);
}

import "../css/RecipeDetails.css";
import { useEffect, useState } from "react";
import { fetchRecipeDetails, fetchRecipeSteps } from "../utils/api";

function RecipeDetails({ recipeId, onBack }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeSteps, setRecipeSteps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the recipe details on page load.
  useEffect(() => {
    let cancelled = false;

    const loadRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
        // Promise allows multiple API calls concurrently; reduces wait
        // time (i.e., 2 x 500ms = 500ms, instead of 1000ms).
        const [details, steps] = await Promise.all([
          fetchRecipeDetails(recipeId),
          fetchRecipeSteps(recipeId),
        ]);

        if (!cancelled) {
          setRecipeDetails(details);
          setRecipeSteps(steps);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Recipe details error:", err);
          setError(err.message || "Failed to load recipe details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRecipe();    

    // Prevent old, stale API data from appearing after new data.
    // This return function is called anytime useEffect is called, before
    // it starts from the top.
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  if (loading) {
    return (
      <div>
        <button onClick={onBack}>Back</button>
        <p>Loading recipe details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button onClick={onBack}>Back</button>
        <p className="recipes-error">{error}</p>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div>
        <button onClick={onBack}>Back</button>
        <p>Recipe not found.</p>
      </div>
    );
  }

  console.log(recipeSteps);

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <img src={recipeDetails.image} alt={recipeDetails.title} />
      <h2>{recipeDetails.title}</h2>
      {`<p>Summary: {recipeDetails.summary}</p>`}
      <p>Servings: {recipeDetails.servings}</p>
      <p>Total Time: {recipeDetails.readyInMinutes || "Not specified"}</p>
      <p>Prep Time: {recipeDetails.preparationMinutes || "Not specified"}</p>
      <p>Cook Time: {recipeDetails.cookingMinutes || "Not specified"}</p>

      <div className="ingredients-list">
        {recipeDetails.extendedIngredients.map((ingredient) => (
          <p>{ingredient.name}, {ingredient.amount} {ingredient.unit}</p>
        ))}
      </div>

      <div className="recipe-steps">
        {recipeSteps.map((section, sectionIndex) => (
          <div className="steps-section">
            <p>Section: {section.name || "No section name"}</p>

            {section.steps.map((item) => (
              <p className="steps-instructions">
                {item.number}. {item.step}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeDetails;

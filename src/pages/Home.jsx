import "../css/Home.css";
import Pantry from "../components/Pantry";
import Recipes from "../components/Recipes";
import RecipeDetails from "../components/RecipeDetails";
import { useState } from "react";

function Home() {
  const [chips, setChips] = useState([]); // [{ id, name }]
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [filters, setFilters] = useState({
  });

  return (
    <div className="primary-content">
      <div className="pantry-pane">
        <Pantry chips={chips} setChips={setChips} />
      </div>

      <div className="recipes-pane">
        {selectedRecipeId ? (
          <RecipeDetails
            recipeId={selectedRecipeId}
            onBack={() => setSelectedRecipeId(null)}
          />
        ) : (
          <Recipes
            chips={chips}
            filters={filters}
            onSelectRecipe={setSelectedRecipeId}
          />
        )}
      </div>
    </div>
  );
}

export default Home;

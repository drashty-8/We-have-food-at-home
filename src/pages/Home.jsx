import "../css/Home.css";
import Pantry from "../components/Pantry";
import Recipes from "../components/Recipes";
import RecipeDetails from "../components/RecipeDetails";
import { useState } from "react";

function Home() {
  const [chips, setChips] = useState([]); // [{ id, name }]
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({
    cuisine: [],
    excludeCuisine: [],
    diet: [],
    intolerances: [],
  });

  console.log("Selected recipe in Home.jsx:");
  console.log(selectedRecipe);

  return (
    <div className="primary-content">
      <div className="pantry-pane">
        <Pantry chips={chips} setChips={setChips} />
      </div>

      <div className="recipes-pane">
        {selectedRecipe ? (
          <>
            {console.log("Passing to RecipeDetails: ", selectedRecipe)}
            <RecipeDetails
              recipe={selectedRecipe}
              onBack={() => setSelectedRecipe(null)}
            />
          </>
        ) : (
          <Recipes
            chips={chips}
            filters={filters}
            setFilters={setFilters}
            onSelectRecipe={setSelectedRecipe}
          />
        )}
      </div>
    </div>
  );
}

export default Home;

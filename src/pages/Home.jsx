import "../css/Home.css";
import Pantry from "../components/Pantry";
import Recipes from "../components/Recipes";
import RecipeDetails from "../components/RecipeDetails";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { loadPantry, savePantry } from "../utils/db";

function Home() {
  const [chips, setChips] = useState([]); // [{ id, name }]
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hasSearched, setHasSearched] = useState(false); // differentiates whether a blank screen is no recipes, or not yet searched
  const [filters, setFilters] = useState({
    cuisine: [],
    excludeCuisine: [],
    diet: [],
    intolerances: [],
  });

  console.log("Selected recipe in Home.jsx:");
  console.log(selectedRecipe);
  
const [loaded, setLoaded] = useState(false); //tracks if pantry has loaded
//loads pantry when page opens
  useEffect(() => {
  const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const pantry = await loadPantry(user.uid);
      setChips(pantry);
      setLoaded(true); //mark pantry as loaded
    }
  });
  return () => unsubscribeAuth();
}, []); //[] means run when page loads

  //saves pantry whenever chips change
  useEffect(() => {
    if (!loaded) return; // don't save until we've loaded first
    const save = async() => {
      const user = auth.currentUser;
      if(user) {
        await savePantry(user.uid, chips);
      }
    };
    save();
  }, [chips, loaded]); //run when chips change
  
  
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
            recipes={recipes}
            setRecipes={setRecipes}
            hasSearched={hasSearched}
            setHasSearched={setHasSearched}
          />
        )}
      </div>
    </div>
  );
}

export default Home;

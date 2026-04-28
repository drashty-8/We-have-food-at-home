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

<<<<<<< HEAD
  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
      />
    );
  }

=======
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
  
  
>>>>>>> origin/main
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
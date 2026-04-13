function Home() {
  const [chips, setChips] = useState([]); 
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  return (
    <main className="primary-content">
      <section className="pantry-pane" aria-label="Ingredient selection">
        <Pantry chips={chips} setChips={setChips} />
      </section>

      <section className="recipes-pane" aria-label="Recipe results">
        {selectedRecipeId ? (
          <RecipeDetails
            recipeId={selectedRecipeId}
            onBack={() => setSelectedRecipeId(null)}
          />
        ) : (
          <Recipes
            chips={chips}
            onSelectRecipe={setSelectedRecipeId}
          />
        )}
      </section>
    </main>
  );
}
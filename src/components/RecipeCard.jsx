import "../css/RecipeCard.css";

function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img className="recipe-img" src={recipe.image} alt={recipe.title} />
      <p className="recipe-title">{recipe.title}</p>
    </div>
  );
}

export default RecipeCard;

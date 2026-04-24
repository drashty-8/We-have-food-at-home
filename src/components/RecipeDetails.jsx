import "../css/RecipeDetails.css";
import { useEffect, useState } from "react";
import { fetchRecipeDetails, fetchRecipeSteps } from "../utils/api";
import { db, auth } from "../config/firebase";
import { doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import DOMPurify from "dompurify";

function RecipeDetails({ recipeId, onBack }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeSteps, setRecipeSteps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. REAL-TIME FAVORITE SYNC
  useEffect(() => {
    if (!auth.currentUser || !recipeId) return;

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", recipeId.toString());
    
    const unsubscribe = onSnapshot(favRef, (docSnap) => {
      setIsFavorite(docSnap.exists());
    });

    return () => unsubscribe();
  }, [recipeId]);

  // 2. API DATA LOAD
  useEffect(() => {
    let cancelled = false;

    const loadRecipe = async () => {
      setLoading(true);
      setError(null);

      try {
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
    return () => { cancelled = true; };
  }, [recipeId]);

  // 3. TOGGLE FAVORITE HANDLER
  const handleToggleFavorite = async () => {
    if (!auth.currentUser) {
      alert("Please log in to save favorites!");
      return;
    }

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", recipeId.toString());

    try {
      if (isFavorite) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          id: recipeId,
          title: recipeDetails.title,
          image: recipeDetails.image,
          addedAt: new Date()
        });
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (loading) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p>Loading your next meal...</p>
    </div>
  );

  if (error) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p className="recipes-error">{error}</p>
    </div>
  );

  if (!recipeDetails) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p>Recipe not found.</p>
    </div>
  );

  return (
    <div className="recipe-details-container">
      <button className="back-button" onClick={onBack}>← Back</button>

      <img
        className="recipe-details-img"
        src={recipeDetails.image}
        alt={recipeDetails.title}
      />

      <h2 className="recipe-details-title">{recipeDetails.title}</h2>

      <div className="recipe-summary" 
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(recipeDetails.summary, {FORBID_TAGS: ['a']})
        }}
      />

      <div className="recipe-meta">
        <span className="recipe-meta-item"><strong>Servings:</strong> {recipeDetails.servings}</span>
        <span className="recipe-meta-item"><strong>Total:</strong> {recipeDetails.readyInMinutes || "—"} min</span>
        <span className="recipe-meta-item"><strong>Prep:</strong> {recipeDetails.preparationMinutes || "—"} min</span>
        <span className="recipe-meta-item"><strong>Cook:</strong> {recipeDetails.cookingMinutes || "—"} min</span>
      </div>

      <div className="ingredients-section">
        <h3>Ingredients</h3>
        <div className="ingredients-list">
          {recipeDetails.extendedIngredients.map((ingredient) => (
            <p className="ingredient-item" key={ingredient.id}>
              {ingredient.amount} {ingredient.unit} — {ingredient.name}
            </p>
          ))}
        </div>
      </div>

      <div className="steps-section">
        <h3>Instructions</h3>
        {recipeSteps.map((section, sectionIndex) => (
          <div key={sectionIndex} className="instruction-group">
            {section.name && <p className="steps-section-name">{section.name}</p>}
            {section.steps.map((item) => (
              <div className="step-item" key={item.number}>
                <span className="step-number">{item.number}</span>
                <span className="step-text">{item.step}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="recipe-footer">
        <hr className="footer-divider" />
        <p>Enjoyed this recipe?</p>
        <button 
          className={`favorite-btn-bottom ${isFavorite ? "active" : ""}`} 
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "❤️ Saved to Favorites" : "🤍 Save for Later"}
        </button>
      </div>
    </div>
  );
}

export default RecipeDetails;        const [details, steps] = await Promise.all([
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
    return () => { cancelled = true; };
  }, [recipeId]);

  // 3. TOGGLE FAVORITE HANDLER
  const handleToggleFavorite = async () => {
    if (!auth.currentUser) {
      alert("Please log in to save favorites!");
      return;
    }

    const favRef = doc(db, "users", auth.currentUser.uid, "favorites", recipeId.toString());

    try {
      if (isFavorite) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          id: recipeId,
          title: recipeDetails.title,
          image: recipeDetails.image,
          addedAt: new Date()
        });
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (loading) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p>Loading your next meal...</p>
    </div>
  );

  if (error) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p className="recipes-error">{error}</p>
    </div>
  );

  if (!recipeDetails) return (
    <div className="details-state">
      <button className="back-button" onClick={onBack}>← Back</button>
      <p>Recipe not found.</p>
    </div>
  );

  return (
    <div className="recipe-details-container">
      <button className="back-button" onClick={onBack}>← Back</button>

      <img
        className="recipe-details-img"
        src={recipeDetails.image}
        alt={recipeDetails.title}
      />

      <h2 className="recipe-details-title">{recipeDetails.title}</h2>

      <div className="recipe-summary" 
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(recipeDetails.summary, {FORBID_TAGS: ['a']})
        }}
      />

      <div className="recipe-meta">
        <span className="recipe-meta-item"><strong>Servings:</strong> {recipeDetails.servings}</span>
        <span className="recipe-meta-item"><strong>Total:</strong> {recipeDetails.readyInMinutes || "—"} min</span>
        <span className="recipe-meta-item"><strong>Prep:</strong> {recipeDetails.preparationMinutes || "—"} min</span>
        <span className="recipe-meta-item"><strong>Cook:</strong> {recipeDetails.cookingMinutes || "—"} min</span>
      </div>

      <div className="ingredients-section">
        <h3>Ingredients</h3>
        <div className="ingredients-list">
          {recipeDetails.extendedIngredients.map((ingredient) => (
            <p className="ingredient-item" key={ingredient.id}>
              {ingredient.amount} {ingredient.unit} — {ingredient.name}
            </p>
          ))}
        </div>
      </div>

      <div className="steps-section">
        <h3>Instructions</h3>
        {recipeSteps.map((section, sectionIndex) => (
          <div key={sectionIndex} className="instruction-group">
            {section.name && <p className="steps-section-name">{section.name}</p>}
            {section.steps.map((item) => (
              <div className="step-item" key={item.number}>
                <span className="step-number">{item.number}</span>
                <span className="step-text">{item.step}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="recipe-footer">
        <hr className="footer-divider" />
        <p>Enjoyed this recipe?</p>
        <button 
          className={`favorite-btn-bottom ${isFavorite ? "active" : ""}`} 
          onClick={handleToggleFavorite}
        >
          {isFavorite ? "❤️ Saved to Favorites" : "🤍 Save for Later"}
        </button>
      </div>
    </div>
  );
}

export default RecipeDetails;

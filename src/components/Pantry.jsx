import "../css/Pantry.css";
import { useEffect, useState } from "react";
import { fetchIngredientSuggestions } from "../utils/api";
import { useDebouncedValue } from "../utils/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

function Pantry({ chips, setChips }) {
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Debounce the query so we don't fire on every keystroke.
  const debouncedQuery = useDebouncedValue(ingredientQuery, 300);

  //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);


  // Fetch autocomplete suggestions when the debounced query changes.
  useEffect(() => {
    // Skip short queries to save API calls.
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    // Call the API.
    fetchIngredientSuggestions(debouncedQuery)
      .then((data) => {
        if (!cancelled) {
          setSuggestions(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Autocomplete error:", err);
          setError("Could not load suggestions. Please try again.");
          setSuggestions([]);
        }
      });

    // Prevent out-of-order suggestions from multiple async calls. Could
    // happen when this useEffect is run again after debouncedQuery is
    // updated, but the previous API call is already in progress.
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Add a chip (ingredient) only from an autocomplete suggestion.
  const addChipFromSuggestion = (suggestionName) => {
    const normalizedName = suggestionName.trim().toLowerCase();
    if (!normalizedName) return;

    const newChip = {
      id: `id:${normalizedName}`,
      name: normalizedName,
    };

    // Prevent duplicates.
    const exists = chips.some((chip) => chip.id === newChip.id);
    if (exists) {
      setIngredientQuery("");
      setSuggestions([]);
      return;
    }

    // Alphabetize the chips (ingredients) in the pantry.
    setChips((prev) => {
      const updated = [...prev, newChip];
      updated.sort((a, b) => a.name.localeCompare(b.name));
      return updated;
    });

    // Reset the text in the search bar and the suggestions.
    setIngredientQuery("");
    setSuggestions([]);
  };

  const removeChip = (id) => {
    setChips((prev) => prev.filter((chip) => chip.id !== id));
  };

  return (
    <div className="pantry">
      {!isLoggedIn && (
        <p className="pantry-hint">
          <em>Sign in to save your pantry across sessions.</em>
        </p>
      )}

      <input
        type="text"
        placeholder="Search for an ingredient..."
        className="ingredient-input"
        value={ingredientQuery}
        onChange={(event) => setIngredientQuery(event.target.value)}
      />

      {error && <p className="pantry-error">{error}</p>}

      {suggestions.length > 0 && (
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id ?? suggestion.name}
              type="button"
              onClick={() => addChipFromSuggestion(suggestion.name)}
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      )}

      <div className="chip-row">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className="chip"
            onClick={() => removeChip(chip.id)}
            title="Click to remove"
          >
            {chip.name} ×
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pantry;

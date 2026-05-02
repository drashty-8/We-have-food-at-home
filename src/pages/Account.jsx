import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { loadPreferences, savePreferences } from "../utils/db";
import { useOutletContext } from "react-router-dom";
import "../css/Account.css";

const diets = [
  "gluten free", "ketogenic", "vegetarian", "lacto-vegetarian",
  "ovo-vegetarian", "vegan", "pescetarian", "paleo", "primal", "low fodmap",
  "whole30"
];

const intolerances = [
  "dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame",
  "shellfish", "soy", "sulfite", "tree nut", "wheat"
];

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({ diet: [], intolerances: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { refreshPreferences } = useOutletContext();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const prefs = await loadPreferences(currentUser.uid);
        setPreferences(prefs);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  const togglePreferences = (category, item) => {
    setPreferences((prev) => {
      const current = prev[category];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return { ...prev, [category]: updated };
    });
    setSaved(false)
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    try {
      await savePreferences(user.uid, preferences);
      await refreshPreferences();
      setSaved(true);
    } catch (error) {
      console.error("Error saving preferences: ", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  if (loading) {
    return <p className="account-msg">Loading account...</p>
  }

  if (!user) {
    return <p className="account-msg">Please log in to view your account.</p>
  }

  return (
    <div className="account-page">
      <h2 className="page-header">Account</h2>

      <section className="account-section">
        <h3>Email</h3>
        <p className="account-email">{user.email}</p>
      </section>

      <section className="account-section">
        <h3>Dietary Preferences</h3>
        <p className="account-section-hint">
          These will be applied to your recipe searches by default.
        </p>

        <div className="preferences-group">
          <p className="preferences-group-label">Diets</p>
          <div className="checkbox-grid">
            {diets.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={preferences.diet.includes(item)}
                  onChange={() => togglePreferences("diet", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="preferences-group">
          <p className="preferences-group-label">Intolerances</p>
          <div className="checkbox-grid">
            {intolerances.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={preferences.intolerances.includes(item)}
                  onChange={() => togglePreferences("intolerances", item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="save-preferences-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Preferences"}
        </button>
      </section>

      <section className="account-section">
        <button
          type="button"
          className="logout-btn-page"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </section>
    </div>
  );
}

export default Account;

import "../css/Layout.css";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Pantry from "./Pantry";
import { auth } from "../config/firebase";
import { loadPantry, loadPreferences, savePantry } from "../utils/db";

function Layout() {
  const [chips, setChips] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [preferences, setPreferences] = useState({ diet: [], intolerances: [] })

  // Load pantry and preferences when a user signs in
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const [pantry, prefs] = await Promise.all([
          loadPantry(user.uid),
          loadPreferences(user.id),
        ]);

        setChips(pantry);
        setPreferendces(prefs);
        setLoaded(true);
      } else {
        // Clear pantry and preferences on logout so next user doesn't see old chips
        setChips([]);
        setPreferences({ diet: [], intolerances: [] });
        setLoaded(false);
      }
    });
    return () => unsubscribeAuth();
  }, []); // [] means run when page loads

  // Save pantry whenever chips change,  but only after the initial load
  useEffect(() => {
    if (!loaded) return;
    const save = async () => {
      const user = auth.currentUser;
      if (user) {
        await savePantry(user.uid, chips);
      }
    };
    save();
  }, [chips, loaded]);

  // Allow account to refresh preferences after saving
  const refreshPreferences = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const prefs = await loadPreferences(user.uid);
    setPreferences(prefs);
  }

  return (
    <>
      <NavBar />
      <main className="app-layout">
        <aside className="pantry-pane">
          <Pantry chips={chips} setChips={setChips} />
        </aside>
        <section className="content-pane">
          <Outlet context={{ chips, setChips, preferences, refreshPreferences }} />
        </section>
      </main>
    </>
  )
}

export default Layout;
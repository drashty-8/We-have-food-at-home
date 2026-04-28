import "../css/Layout.css";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Pantry from "./Pantry";
import { auth } from "../config/firebase";
import { loadPantry, savePantry } from "../utils/db";

function Layout() {
  const [chips, setChips] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load pantry when a user signs in
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const pantry = await loadPantry(user.uid);
        setChips(pantry);
        setLoaded(true);
      } else {
        // Clear pantry on logout so next user doesn't see old chips
        setChips([]);
        setLoaded(false);
      }
    });
    return () => unsubscribeAuth();
  }, []); // [] means run when page loads

  // Save pantry whenever chips change — but only after the initial load
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


  return (
    <>
      <NavBar />
      <main className="app-layout">
        <aside className="pantry-pane">
          <Pantry chips={chips} setChips={setChips} />
        </aside>
        <section className="content-pane">
          <Outlet context={{ chips, setChips }} />
        </section>
      </main>
    </>
  )
}

export default Layout;
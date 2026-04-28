import "../css/NavBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);  // handles closing account dropdown on clicking outside

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/login");  // Redirect to login page after signing out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Identify if the current page is active, which will be used to apply CSS styles
  // to indicate the page in the NavBar is currently accessed.
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">We Have Food at Home</Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>

        {user ? (
          <>
            <Link to="/favorites" className={isActive("/favorites") ? "active" : ""}>Favorites</Link>
            <Link to="/recents" className={isActive("/recents") ? "active" : ""}>Recents</Link>
            <Link to="/shopping-list" className={isActive("/shopping-list") ? "active" : ""}>Shopping List</Link>

            <div className="navbar-menu" ref={menuRef}>
              <button
                type="button"
                className="navbar-menu-trigger"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                Account ▾
              </button>

              {menuOpen && (
                <div className="navbar-menu-dropdown" role="menu">
                  <Link
                    to="/account"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
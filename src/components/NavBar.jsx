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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <Link to="/" className="brand-link" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="logo" className="navbar-logo" />
          <span>We Have Food at Home</span>
        </Link>
      </div>

      <button
        type="button"
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <div className={`navbar-links ${mobileMenuOpen ? "navbar-links-open" : ""}`}>
        <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Home</Link>

        {user ? (
          <>
            <Link to="/favorites" className={isActive("/favorites") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Favorites</Link>
            <Link to="/recents" className={isActive("/recents") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Recents</Link>
            <Link to="/shopping-list" className={isActive("/shopping-list") ? "active" : ""} onClick={() => setMobileMenuOpen(false)}>Shopping List</Link>

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
                    onClick={() => { setMenuOpen(false); setMobileMenuOpen(false); }}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="login-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
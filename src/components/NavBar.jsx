import "../css/NavBar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase"; 

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const hideOn = ["/login", "/register"];
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after signing out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (hideOn.includes(location.pathname)) return null;

  let authLink;
  if (user) {
    authLink = <Link to= "/account">Account</Link>;
  } else {
    authLink = <Link to= "/login">Login</Link>;
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">We Have Food at Home</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        
        {user ? (
          <>
            {/* Show these only if logged in */}
            <Link to="/favorites">Favorites</Link>
            <Link to="/account">Account</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

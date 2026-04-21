import "../css/NavBar.css";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"; 

function NavBar() {
  const location = useLocation();
  const hideOn = ["/login", "/register"];
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })
    return () => unsubscribe(); 
  }, []);

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
        <Link to="/">Home</Link>
        {authLink}
      </div>
    </nav>
  );
}

export default NavBar;

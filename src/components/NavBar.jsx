import "../css/NavBar.css";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const hideOn = ["/login", "/register"];

  if (hideOn.includes(location.pathname)) return null;
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">We Have Food at Home</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/account">Account</Link>
      </div>
    </nav>
  );
}

export default NavBar;

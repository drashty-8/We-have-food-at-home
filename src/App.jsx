import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites"; 
import Recents from "./pages/Recents";
import ShoppingList from "./pages/ShoppingList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recents" element={<Recents />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;

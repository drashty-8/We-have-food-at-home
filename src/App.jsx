import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Account from "./pages/Account";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

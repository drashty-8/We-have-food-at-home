import { useState } from "react";
import { auth, provider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../css/auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            setError("Google sign-in failed.");
        }
    };
//make pretty 
return (
    <div className="auth-container">
    <div className="card">
        <div className="card-header">
            <h2>We Have Food At Home</h2>
            <p>Welcome back! Log in to your pantry.</p>
        </div>
        <div className="card-body">
            {error && <p style={{color: "red"}}>{error}</p>}

        <form onSubmit={handleLogin}>
            <label>Email</label><br />
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        /><br /><br />

            <label>Password:</label><br />
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        /><br /><br />

            <button type="submit">Log In</button>
        </form>

            <button onClick={handleGoogleLogin}>Log in with Google</button>
                <p style={{marginTop: "1rem"}}>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
     </div>
    );
}
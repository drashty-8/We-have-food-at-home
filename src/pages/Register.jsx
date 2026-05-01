import { useEffect, useState } from "react";
import { auth, provider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../css/auth.css";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleRegister = async(e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setError("Could not create account. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            setError("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="auth-container">
        <Link to="/" className="auth-logo-link">
        <img src="/logo.png" alt="We Have Food at Home" className="auth-logo" />
        </Link>
    
    <div className="card">
        <div className="card-header">
            <h2>We Have Food At Home</h2>
            <p>Create your pantry account.</p>
        </div>

    <div className="card-body">
        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
        <form onSubmit={handleRegister}>

            <label htmlFor="email">Email:</label>
            <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

            <label htmlFor="password">Password:</label>
            <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

            <button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
            </button>
        </form>

    <div className="social-login">
        <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
        >
            {loading ? "Please wait..." : "Sign up with Google"}
            </button>
        </div>
        <p style={{marginTop: "1rem"}}>
            Already have an account? <Link to="/login">Log in</Link>
        </p>
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { auth, provider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../css/auth.css";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate;

    const handleRegister = async(e) => {
        e.preventDefault();
        setError("");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account created!");
            //redirect to home page
            navigate("/");
        } catch (err) {
            setError(err.message);
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


return (
    <div className="auth-container">
    <div className="card">
        <div className="card-header">
            <h2>We Have Food At Home</h2>
            <p>Create your pantry account.</p>
        </div>

        <div className="card-body">
            {error && <p style={{color: "red"}}>{error}</p>}

        <form onSubmit={handleRegister}>
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

            <button type="submit">Create Account</button>
        </form>

            <button onClick={handleGoogleLogin}>Sign up with Google</button>
                <p style={{marginTop: "1rem"}}>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
        </div>
     </div>
    );
}
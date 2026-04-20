// src/pages/Signup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        setLoading(true);
        try {
            await signup(email, password, name);
            toast.success("Account created! Welcome 🚀");
            navigate("/");
        } catch (err) {
            toast.error(err.message.includes("email-already-in-use") ? "Email already used" : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 1, padding: "1rem"
        }}>
            <div style={{
                position: "absolute", top: "20%", right: "10%",
                width: 350, height: 350, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,255,136,0.06), transparent 70%)",
                pointerEvents: "none"
            }} />

            <div style={{ width: "100%", maxWidth: 420 }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 64, height: 64, borderRadius: 16,
                        background: "linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,212,255,0.2))",
                        border: "1px solid rgba(0,255,136,0.4)",
                        fontSize: "1.8rem", marginBottom: "1rem",
                        boxShadow: "var(--shadow-green)"
                    }}>₹</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "var(--neon-green)", textShadow: "0 0 20px rgba(0,255,136,0.6)" }}>
                        FINTRACK
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                        Create your account
                    </div>
                </div>

                <div className="card" style={{ borderColor: "rgba(0,255,136,0.2)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        NEW ACCOUNT
                    </div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                        Sign Up
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem" }}>
                            <label className="label">Your Name</label>
                            <input
                                className="input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Rohan Sharma"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label className="label">Email</label>
                            <input
                                className="input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@college.edu"
                                required
                            />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label className="label">Password</label>
                            <input
                                className="input"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="min 6 characters"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: "100%", padding: "0.85rem", fontSize: "0.8rem", background: "linear-gradient(135deg, var(--neon-green), #009944)", boxShadow: "0 0 15px rgba(0,255,136,0.3)" }}
                        >
                            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
                        </button>
                    </form>

                    <div className="divider" />
                    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "var(--neon-cyan)", textDecoration: "none", fontWeight: 600 }}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
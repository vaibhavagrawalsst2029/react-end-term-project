// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (err) {
            toast.error(err.message.includes("user-not-found") ? "No account found" :
                err.message.includes("wrong-password") ? "Wrong password" : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
            padding: "1rem"
        }}>
            {/* Glow orbs */}
            <div style={{
                position: "absolute", top: "20%", left: "15%",
                width: 300, height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", bottom: "20%", right: "15%",
                width: 250, height: 250,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(179,68,255,0.08), transparent 70%)",
                pointerEvents: "none"
            }} />

            <div style={{ width: "100%", maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64, height: 64,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(179,68,255,0.2))",
                        border: "1px solid var(--border-glow)",
                        fontSize: "1.8rem",
                        marginBottom: "1rem",
                        boxShadow: "var(--shadow-cyan)"
                    }}>₹</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "var(--neon-cyan)", textShadow: "0 0 20px rgba(0,212,255,0.6)" }}>
                        FINTRACK
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
                        Student Finance Tracker
                    </div>
                </div>

                <div className="card">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        ACCESS PORTAL
                    </div>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "1.5rem" }}>
                        Sign In
                    </h1>

                    <form onSubmit={handleSubmit}>
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
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: "100%", padding: "0.85rem", fontSize: "0.8rem" }}
                        >
                            {loading ? "AUTHENTICATING..." : "SIGN IN →"}
                        </button>
                    </form>

                    <div className="divider" />
                    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        No account?{" "}
                        <Link to="/signup" style={{ color: "var(--neon-cyan)", textDecoration: "none", fontWeight: 600 }}>
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
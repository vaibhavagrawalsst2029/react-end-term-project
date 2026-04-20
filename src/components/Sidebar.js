// src/components/Sidebar.js
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV = [
    { path: "/", icon: "⬡", label: "Dashboard" },
    { path: "/expenses", icon: "◈", label: "Expenses" },
    { path: "/budget", icon: "◉", label: "Budget" },
    { path: "/splits", icon: "◫", label: "Splits" },
    { path: "/insights", icon: "◬", label: "Insights" },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out");
        navigate("/login");
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="mobile-toggle"
                onClick={() => setMobileOpen(p => !p)}
                style={{
                    display: "none",
                    position: "fixed", bottom: "1rem", right: "1rem",
                    zIndex: 500, background: "var(--neon-cyan)",
                    border: "none", borderRadius: "50%",
                    width: 52, height: 52, fontSize: "1.2rem",
                    cursor: "pointer", color: "#000",
                    boxShadow: "var(--shadow-cyan)"
                }}
            >
                ☰
            </button>

            <aside style={{
                width: 260,
                background: "var(--bg-secondary)",
                borderRight: "1px solid var(--border)",
                height: "100vh",
                position: "fixed",
                top: 0, left: 0,
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                transition: "transform 0.3s"
            }}>
                {/* Logo */}
                <div style={{ padding: "1.8rem 1.5rem 1.2rem" }}>
                    <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.7rem",
                        letterSpacing: "0.3em",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        marginBottom: "0.3rem"
                    }}>STUDENT</div>
                    <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.1rem",
                        fontWeight: 900,
                        color: "var(--neon-cyan)",
                        textShadow: "0 0 15px rgba(0,212,255,0.6)",
                        letterSpacing: "0.1em"
                    }}>FINTRACK</div>
                    <div style={{
                        height: 2,
                        background: "linear-gradient(90deg, var(--neon-cyan), transparent)",
                        marginTop: "0.8rem",
                        borderRadius: 1
                    }} />
                </div>

                {/* User pill */}
                <div style={{
                    margin: "0 1rem 1.2rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(0,212,255,0.06)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                }}>
                    <div style={{
                        width: 32, height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: 700, color: "#000",
                        flexShrink: 0
                    }}>
                        {(user?.displayName || user?.email || "U")[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{
                            fontSize: "0.85rem", fontWeight: 600,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                        }}>
                            {user?.displayName || "Student"}
                        </div>
                        <div style={{
                            fontSize: "0.7rem", color: "var(--text-muted)",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                        }}>
                            {user?.email}
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "0 0.75rem" }}>
                    <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        color: "var(--text-muted)",
                        padding: "0 0.75rem",
                        marginBottom: "0.5rem"
                    }}>NAVIGATION</div>
                    {NAV.map(({ path, icon, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={path === "/"}
                            style={({ isActive }) => ({
                                display: "flex",
                                alignItems: "center",
                                gap: "0.8rem",
                                padding: "0.75rem 1rem",
                                borderRadius: 8,
                                textDecoration: "none",
                                marginBottom: 4,
                                fontFamily: "var(--font-display)",
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                transition: "all 0.2s",
                                background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                                color: isActive ? "var(--neon-cyan)" : "var(--text-secondary)",
                                borderLeft: isActive ? "2px solid var(--neon-cyan)" : "2px solid transparent",
                                textShadow: isActive ? "0 0 10px rgba(0,212,255,0.5)" : "none",
                            })}
                        >
                            <span style={{ fontSize: "1rem" }}>{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: "1rem" }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            background: "transparent",
                            border: "1px solid rgba(255,45,120,0.3)",
                            borderRadius: 8,
                            color: "var(--neon-pink)",
                            fontFamily: "var(--font-display)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.15em",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem"
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = "rgba(255,45,120,0.1)";
                            e.target.style.boxShadow = "0 0 15px rgba(255,45,120,0.3)";
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = "transparent";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        ⏻ LOGOUT
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
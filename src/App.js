// src/App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import "./index.css";

// Lazy loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Budget = lazy(() => import("./pages/Budget"));
const Splits = lazy(() => import("./pages/Splits"));
const Insights = lazy(() => import("./pages/Insights"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const PageLoader = () => (
    <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-primary)"
    }}>
        <div style={{
            fontFamily: "var(--font-display)", fontSize: "0.7rem",
            letterSpacing: "0.3em", color: "var(--neon-cyan)",
            animation: "pulse 1.5s ease-in-out infinite"
        }}>
            LOADING...
        </div>
        <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}</style>
    </div>
);

const AppLayout = ({ children }) => (
    <div className="page-wrapper">
        <Sidebar />
        <main className="main-content">
            {children}
        </main>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <FinanceProvider>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />

                            {/* Protected */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <AppLayout><Dashboard /></AppLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/expenses" element={
                                <ProtectedRoute>
                                    <AppLayout><Expenses /></AppLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/budget" element={
                                <ProtectedRoute>
                                    <AppLayout><Budget /></AppLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/splits" element={
                                <ProtectedRoute>
                                    <AppLayout><Splits /></AppLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/insights" element={
                                <ProtectedRoute>
                                    <AppLayout><Insights /></AppLayout>
                                </ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: "var(--bg-card)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-glow)",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.9rem"
                            },
                            success: { iconTheme: { primary: "#00ff88", secondary: "#000" } },
                            error: { iconTheme: { primary: "#ff2d78", secondary: "#000" } }
                        }}
                    />
                </FinanceProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
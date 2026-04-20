// src/pages/Budget.js
import React, { useState, useEffect } from "react";
import { useFinance, CATEGORIES } from "../context/FinanceContext";
import toast from "react-hot-toast";

const Budget = () => {
    const { budgets, saveBudgets, spendingByCategory, totalSpent, totalBudget, currentMonth } = useFinance();
    const [localBudgets, setLocalBudgets] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLocalBudgets(budgets || {});
    }, [budgets]);

    const handleChange = (catId, val) => {
        setLocalBudgets(prev => ({ ...prev, [catId]: val }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const cleaned = {};
            Object.entries(localBudgets).forEach(([k, v]) => {
                if (v && !isNaN(v) && Number(v) > 0) cleaned[k] = Number(v);
            });
            await saveBudgets(cleaned);
            toast.success("Budget saved!");
        } catch {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const totalLocalBudget = Object.values(localBudgets).reduce((s, v) => s + Number(v || 0), 0);

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title">Budget Planner</h1>
                <p className="page-subtitle">Set monthly limits per category and track in real-time</p>
            </div>

            {/* Summary header */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {[
                    { label: "TOTAL BUDGET", value: `₹${totalLocalBudget.toLocaleString("en-IN")}`, color: "var(--neon-cyan)" },
                    { label: "TOTAL SPENT", value: `₹${totalSpent.toLocaleString("en-IN")}`, color: "var(--neon-pink)" },
                    { label: "REMAINING", value: `₹${Math.max(totalLocalBudget - totalSpent, 0).toLocaleString("en-IN")}`, color: "var(--neon-green)" },
                ].map(s => (
                    <div key={s.label} className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{s.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: s.color, textShadow: `0 0 15px ${s.color}50` }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Category budgets */}
            <div className="card">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                    SET BUDGET BY CATEGORY — {currentMonth}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {CATEGORIES.map(cat => {
                        const spent = spendingByCategory[cat.id] || 0;
                        const budget = Number(localBudgets[cat.id] || 0);
                        const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
                        const over = spent > budget && budget > 0;

                        return (
                            <div key={cat.id}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                                    {/* Icon + label */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 160 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 8,
                                            background: `${cat.color}15`,
                                            border: `1px solid ${cat.color}30`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: "1rem", flexShrink: 0
                                        }}>{cat.icon}</div>
                                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{cat.label}</span>
                                    </div>

                                    {/* Input */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: 160 }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>₹</span>
                                        <input
                                            className="input"
                                            style={{ maxWidth: 140 }}
                                            type="number"
                                            min="0"
                                            placeholder="Set limit"
                                            value={localBudgets[cat.id] || ""}
                                            onChange={e => handleChange(cat.id, e.target.value)}
                                        />
                                    </div>

                                    {/* Spent vs budget info */}
                                    <div style={{ display: "flex", gap: "1rem", marginLeft: "auto", fontSize: "0.8rem" }}>
                                        <span style={{ color: "var(--text-muted)" }}>Spent: <span style={{ color: over ? "var(--neon-pink)" : "var(--text-primary)" }}>₹{spent.toLocaleString("en-IN")}</span></span>
                                        {over && <span style={{ color: "var(--neon-pink)", fontFamily: "var(--font-display)", fontSize: "0.65rem" }}>⚠ OVER</span>}
                                    </div>
                                </div>

                                {/* Progress */}
                                {budget > 0 && (
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{
                                            width: `${pct}%`,
                                            background: over
                                                ? "linear-gradient(90deg, var(--neon-yellow), var(--neon-pink))"
                                                : pct > 70
                                                    ? `linear-gradient(90deg, ${cat.color}, var(--neon-yellow))`
                                                    : cat.color,
                                            boxShadow: `0 0 8px ${cat.color}60`
                                        }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 140 }}>
                        {saving ? "SAVING..." : "SAVE BUDGET"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Budget;
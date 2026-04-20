// src/pages/Insights.js
import React, { useMemo } from "react";
import { useFinance, CATEGORIES } from "../context/FinanceContext";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell
} from "recharts";

const Insights = () => {
    const { expenses, spendingByCategory, totalSpent, budgets, currentMonth } = useFinance();

    // Monthly totals for bar chart (last 6 months)
    const monthlyData = useMemo(() => {
        const map = {};
        expenses.forEach(e => {
            if (e.date) {
                const m = e.date.slice(0, 7);
                map[m] = (map[m] || 0) + Number(e.amount);
            }
        });
        return Object.entries(map)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6)
            .map(([month, amount]) => ({ month: month.slice(5), amount }));
    }, [expenses]);

    // Top spending category
    const topCat = useMemo(() => {
        const sorted = CATEGORIES
            .map(c => ({ ...c, spent: spendingByCategory[c.id] || 0 }))
            .filter(c => c.spent > 0)
            .sort((a, b) => b.spent - a.spent);
        return sorted[0] || null;
    }, [spendingByCategory]);

    // Radar data
    const radarData = useMemo(() =>
        CATEGORIES.map(c => ({
            category: c.icon + " " + c.label.split(" ")[0],
            spent: spendingByCategory[c.id] || 0,
            budget: budgets[c.id] || 0
        })).filter(d => d.spent > 0 || d.budget > 0),
        [spendingByCategory, budgets]
    );

    // Budget efficiency
    const efficiency = useMemo(() => {
        const cats = CATEGORIES.filter(c => budgets[c.id] && spendingByCategory[c.id]);
        if (cats.length === 0) return null;
        const totalB = cats.reduce((s, c) => s + Number(budgets[c.id]), 0);
        const totalS = cats.reduce((s, c) => s + Number(spendingByCategory[c.id] || 0), 0);
        return totalB > 0 ? ((1 - totalS / totalB) * 100).toFixed(0) : null;
    }, [budgets, spendingByCategory]);

    // Largest single expense
    const biggestExpense = useMemo(() =>
        expenses.length > 0 ? expenses.reduce((max, e) => Number(e.amount) > Number(max.amount) ? e : max, expenses[0]) : null,
        [expenses]
    );

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title">Insights</h1>
                <p className="page-subtitle">Understand your spending patterns</p>
            </div>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {[
                    { label: "TOP CATEGORY", value: topCat ? `${topCat.icon} ${topCat.label}` : "—", sub: topCat ? `₹${topCat.spent.toLocaleString("en-IN")}` : "", color: topCat?.color || "var(--neon-cyan)" },
                    { label: "BUDGET SAVED", value: efficiency !== null ? `${efficiency}%` : "N/A", sub: efficiency > 0 ? "Under budget" : "Over budget", color: efficiency > 0 ? "var(--neon-green)" : "var(--neon-pink)" },
                    { label: "BIGGEST EXPENSE", value: biggestExpense ? `₹${Number(biggestExpense.amount).toLocaleString("en-IN")}` : "—", sub: biggestExpense?.title || "", color: "var(--neon-purple)" },
                    { label: "TOTAL LOGGED", value: expenses.length, sub: "all-time transactions", color: "var(--neon-yellow)" }
                ].map(s => (
                    <div key={s.label} className="card" style={{ borderColor: `${s.color}25` }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>{s.label}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: s.color, textShadow: `0 0 10px ${s.color}50`, marginBottom: "0.2rem" }}>{s.value}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Monthly bar chart */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    MONTHLY SPENDING TREND
                </div>
                {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={monthlyData} barSize={32}>
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00d4ff" />
                                    <stop offset="100%" stopColor="#0044aa" />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" tick={{ fill: "#3a5570", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#3a5570", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", borderRadius: 8, fontFamily: "var(--font-body)" }}
                                itemStyle={{ color: "var(--neon-cyan)" }}
                                formatter={v => [`₹${Number(v).toLocaleString("en-IN")}`, "Spent"]}
                            />
                            <Bar dataKey="amount" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
                        Not enough data yet
                    </div>
                )}
            </div>

            {/* Category breakdown + Radar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {/* Category breakdown */}
                <div className="card">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                        CATEGORY BREAKDOWN — {currentMonth}
                    </div>
                    {CATEGORIES.filter(c => spendingByCategory[c.id]).length > 0 ? (
                        CATEGORIES.filter(c => spendingByCategory[c.id]).sort((a, b) => spendingByCategory[b.id] - spendingByCategory[a.id]).map(cat => {
                            const spent = spendingByCategory[cat.id];
                            const pct = totalSpent > 0 ? (spent / totalSpent * 100).toFixed(0) : 0;
                            return (
                                <div key={cat.id} style={{ marginBottom: "0.85rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", fontSize: "0.85rem" }}>
                                        <span style={{ color: cat.color }}>{cat.icon} {cat.label}</span>
                                        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                                            ₹{spent.toLocaleString("en-IN")} <span style={{ color: "var(--text-muted)" }}>({pct}%)</span>
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{
                                            width: `${pct}%`,
                                            background: cat.color,
                                            boxShadow: `0 0 6px ${cat.color}60`
                                        }} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No spending data</div>
                    )}
                </div>

                {/* Radar chart */}
                <div className="card">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                        SPEND VS BUDGET RADAR
                    </div>
                    {radarData.length > 2 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(0,212,255,0.1)" />
                                <PolarAngleAxis dataKey="category" tick={{ fill: "#3a5570", fontSize: 10 }} />
                                <Radar name="Spent" dataKey="spent" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.2} />
                                <Radar name="Budget" dataKey="budget" stroke="#b344ff" fill="#b344ff" fillOpacity={0.1} />
                                <Tooltip
                                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", borderRadius: 8 }}
                                    formatter={v => `₹${Number(v).toLocaleString("en-IN")}`}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
                            Add more data to see radar chart
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;
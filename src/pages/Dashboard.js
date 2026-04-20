// src/pages/Dashboard.js
import React, { useState, useMemo } from "react";
import { useFinance, CATEGORIES } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { format, subMonths, addMonths } from "date-fns";
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import ExpenseModal from "../components/ExpenseModal";

const StatCard = ({ label, value, sub, color, icon }) => (
    <div className="card" style={{ borderColor: `${color}30` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    {label}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 700, color, textShadow: `0 0 15px ${color}60` }}>
                    ₹{Number(value).toLocaleString("en-IN")}
                </div>
                {sub && <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>{sub}</div>}
            </div>
            <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${color}15`,
                border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem"
            }}>{icon}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const {
        monthExpenses, totalSpent, totalBudget, spendingByCategory,
        budgetAlerts, currentMonth, setCurrentMonth, createExpense, loading
    } = useFinance();

    const [showModal, setShowModal] = useState(false);

    const pieData = useMemo(() =>
        CATEGORIES
            .filter(c => spendingByCategory[c.id])
            .map(c => ({ name: c.label, value: spendingByCategory[c.id], color: c.color })),
        [spendingByCategory]
    );

    // Daily spending for area chart (last 7 days of current month)
    const areaData = useMemo(() => {
        const map = {};
        monthExpenses.forEach(e => {
            const d = e.date?.slice(8, 10); // day of month
            if (d) map[d] = (map[d] || 0) + Number(e.amount);
        });
        return Object.entries(map)
            .sort((a, b) => a[0] - b[0])
            .slice(-10)
            .map(([day, amount]) => ({ day: `Day ${day}`, amount }));
    }, [monthExpenses]);

    const changeMonth = (dir) => {
        const d = dir === "prev"
            ? subMonths(new Date(currentMonth + "-01"), 1)
            : addMonths(new Date(currentMonth + "-01"), 1);
        setCurrentMonth(format(d, "yyyy-MM"));
    };

    const remaining = totalBudget - totalSpent;
    const budgetPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return (
        <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: 4 }}>
                        WELCOME BACK
                    </div>
                    <h1 className="page-title">{user?.displayName || "Student"}</h1>
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>Here's your financial summary</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <button className="btn btn-ghost" onClick={() => changeMonth("prev")} style={{ padding: "0.5rem 0.75rem" }}>◀</button>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--neon-cyan)", minWidth: 90, textAlign: "center" }}>
                        {format(new Date(currentMonth + "-01"), "MMM yyyy")}
                    </span>
                    <button className="btn btn-ghost" onClick={() => changeMonth("next")} style={{ padding: "0.5rem 0.75rem" }}>▶</button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ ADD</button>
                </div>
            </div>

            {/* Budget alerts */}
            {budgetAlerts.length > 0 && (
                <div style={{
                    marginBottom: "1.5rem",
                    padding: "0.75rem 1rem",
                    background: "rgba(255,230,0,0.06)",
                    border: "1px solid rgba(255,230,0,0.3)",
                    borderRadius: 10,
                    display: "flex", alignItems: "center", gap: "0.75rem"
                }}>
                    <span style={{ fontSize: "1rem" }}>⚡</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--neon-yellow)" }}>
                        Budget alert: {budgetAlerts.map(a => a.label).join(", ")} {budgetAlerts.length === 1 ? "is" : "are"} near or over limit
                    </span>
                </div>
            )}

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <StatCard label="TOTAL SPENT" value={totalSpent} sub={`${monthExpenses.length} transactions`} color="var(--neon-cyan)" icon="💸" />
                <StatCard label="BUDGET LEFT" value={Math.max(remaining, 0)} sub={totalBudget > 0 ? `of ₹${totalBudget.toLocaleString("en-IN")} set` : "No budget set"} color={remaining < 0 ? "var(--neon-pink)" : "var(--neon-green)"} icon="🎯" />
                <StatCard label="THIS MONTH" value={monthExpenses.length > 0 ? (totalSpent / monthExpenses.length).toFixed(0) : 0} sub="avg per transaction" color="var(--neon-purple)" icon="📊" />
            </div>

            {/* Budget progress */}
            {totalBudget > 0 && (
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-secondary)" }}>
                            MONTHLY BUDGET USAGE
                        </span>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: budgetPct > 80 ? "var(--neon-pink)" : "var(--neon-green)" }}>
                            {budgetPct.toFixed(0)}%
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${budgetPct}%`,
                                background: budgetPct > 80
                                    ? "linear-gradient(90deg, var(--neon-yellow), var(--neon-pink))"
                                    : "linear-gradient(90deg, var(--neon-cyan), var(--neon-green))",
                                boxShadow: budgetPct > 80 ? "0 0 8px rgba(255,45,120,0.5)" : "0 0 8px rgba(0,212,255,0.5)"
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {/* Area chart */}
                <div className="card">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                        DAILY SPENDING
                    </div>
                    {areaData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={areaData}>
                                <defs>
                                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" tick={{ fill: "#3a5570", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#3a5570", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", borderRadius: 8, fontFamily: "var(--font-body)" }}
                                    labelStyle={{ color: "var(--text-secondary)" }}
                                    itemStyle={{ color: "var(--neon-cyan)" }}
                                    formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Spent"]}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#00d4ff" strokeWidth={2} fill="url(#cyanGrad)" dot={{ fill: "#00d4ff", strokeWidth: 0, r: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            No data yet
                        </div>
                    )}
                </div>

                {/* Pie chart */}
                <div className="card">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                        BY CATEGORY
                    </div>
                    {pieData.length > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <ResponsiveContainer width="50%" height={160}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1 }}>
                                {pieData.slice(0, 5).map((d, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0, boxShadow: `0 0 5px ${d.color}` }} />
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                                        <span style={{ fontSize: "0.75rem", color: d.color, fontFamily: "var(--font-display)", fontSize: "0.65rem" }}>
                                            ₹{d.value.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            No data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Recent transactions */}
            <div className="card">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: "1rem" }}>
                    RECENT TRANSACTIONS
                </div>
                {monthExpenses.slice(0, 8).length > 0 ? (
                    monthExpenses.slice(0, 8).map(exp => {
                        const cat = CATEGORIES.find(c => c.id === exp.category);
                        return (
                            <div key={exp.id} style={{
                                display: "flex", alignItems: "center", gap: "1rem",
                                padding: "0.75rem 0", borderBottom: "1px solid var(--border)"
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    background: `${cat?.color || "#6b7280"}20`,
                                    border: `1px solid ${cat?.color || "#6b7280"}40`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.9rem", flexShrink: 0
                                }}>{cat?.icon || "💸"}</div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.title}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{exp.date}</div>
                                </div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", color: "var(--neon-pink)", flexShrink: 0 }}>
                                    -₹{Number(exp.amount).toLocaleString("en-IN")}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                        No transactions yet. Add your first expense!
                    </div>
                )}
            </div>

            {showModal && (
                <ExpenseModal onClose={() => setShowModal(false)} onSubmit={createExpense} />
            )}
        </div>
    );
};

export default Dashboard;
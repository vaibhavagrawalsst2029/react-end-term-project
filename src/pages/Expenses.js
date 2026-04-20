// src/pages/Expenses.js
import React, { useState, useMemo } from "react";
import { useFinance, CATEGORIES } from "../context/FinanceContext";
import ExpenseModal from "../components/ExpenseModal";
import toast from "react-hot-toast";

const Expenses = () => {
    const { expenses, createExpense, editExpense, removeExpense, loading } = useFinance();
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    const filtered = useMemo(() => {
        let list = [...expenses];
        if (search) list = list.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
        if (filterCat !== "all") list = list.filter(e => e.category === filterCat);
        if (sortBy === "date") list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        else if (sortBy === "amount") list.sort((a, b) => Number(b.amount) - Number(a.amount));
        return list;
    }, [expenses, search, filterCat, sortBy]);

    const handleEdit = (exp) => {
        setEditTarget(exp);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;
        await removeExpense(id);
        toast.success("Deleted");
    };

    const handleSubmit = async (data) => {
        if (editTarget) {
            await editExpense(editTarget.id, data);
            toast.success("Updated!");
            setEditTarget(null);
        } else {
            await createExpense(data);
            toast.success("Expense added!");
        }
    };

    const totalFiltered = filtered.reduce((s, e) => s + Number(e.amount), 0);

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 className="page-title">Expenses</h1>
                <p className="page-subtitle">All your transactions in one place</p>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <input
                    className="input"
                    style={{ maxWidth: 220 }}
                    placeholder="🔍  Search expenses..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className="input" style={{ maxWidth: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                </select>
                <select className="input" style={{ maxWidth: 140 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="date">Sort: Date</option>
                    <option value="amount">Sort: Amount</option>
                </select>
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {filtered.length} entries · <span style={{ color: "var(--neon-cyan)" }}>₹{totalFiltered.toLocaleString("en-IN")}</span>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowModal(true); }}>
                    + ADD EXPENSE
                </button>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                {["Category", "Title", "Amount", "Date", "Note", "Actions"].map(h => (
                                    <th key={h} style={{
                                        padding: "1rem 1.25rem",
                                        textAlign: "left",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.15em",
                                        color: "var(--text-muted)",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap"
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                                        {loading ? "Loading..." : "No expenses found"}
                                    </td>
                                </tr>
                            ) : filtered.map(exp => {
                                const cat = CATEGORIES.find(c => c.id === exp.category);
                                return (
                                    <tr key={exp.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                                        onMouseLeave={e => e.currentTarget.style.background = ""}
                                    >
                                        <td style={{ padding: "0.85rem 1.25rem" }}>
                                            <div style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                                padding: "0.2rem 0.6rem", borderRadius: 20,
                                                background: `${cat?.color || "#6b7280"}15`,
                                                border: `1px solid ${cat?.color || "#6b7280"}30`,
                                                fontSize: "0.75rem", color: cat?.color || "#6b7280",
                                                whiteSpace: "nowrap"
                                            }}>
                                                {cat?.icon} {cat?.label || exp.category}
                                            </div>
                                        </td>
                                        <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-primary)", fontWeight: 500 }}>
                                            {exp.title}
                                        </td>
                                        <td style={{ padding: "0.85rem 1.25rem", fontFamily: "var(--font-display)", fontSize: "0.85rem", color: "var(--neon-pink)", whiteSpace: "nowrap" }}>
                                            ₹{Number(exp.amount).toLocaleString("en-IN")}
                                        </td>
                                        <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                                            {exp.date}
                                        </td>
                                        <td style={{ padding: "0.85rem 1.25rem", color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {exp.note || "—"}
                                        </td>
                                        <td style={{ padding: "0.85rem 1.25rem" }}>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    onClick={() => handleEdit(exp)}
                                                    style={{
                                                        background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)",
                                                        borderRadius: 6, padding: "0.3rem 0.6rem", cursor: "pointer",
                                                        color: "var(--neon-cyan)", fontSize: "0.75rem", fontFamily: "var(--font-display)"
                                                    }}>EDIT</button>
                                                <button
                                                    onClick={() => handleDelete(exp.id)}
                                                    style={{
                                                        background: "rgba(255,45,120,0.1)", border: "1px solid rgba(255,45,120,0.3)",
                                                        borderRadius: 6, padding: "0.3rem 0.6rem", cursor: "pointer",
                                                        color: "var(--neon-pink)", fontSize: "0.75rem", fontFamily: "var(--font-display)"
                                                    }}>DEL</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <ExpenseModal
                    onClose={() => { setShowModal(false); setEditTarget(null); }}
                    onSubmit={handleSubmit}
                    editData={editTarget}
                />
            )}
        </div>
    );
};

export default Expenses;
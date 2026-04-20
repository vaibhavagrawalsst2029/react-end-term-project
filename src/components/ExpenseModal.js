// src/components/ExpenseModal.js
import React, { useEffect } from "react";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { CATEGORIES } from "../context/FinanceContext";

const ExpenseModal = ({ onClose, onSubmit, editData = null }) => {
    const { form, setForm, errors, handleChange, validate, reset } = useExpenseForm(
        editData || undefined
    );

    useEffect(() => {
        if (editData) setForm(editData);
    }, [editData, setForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit({ ...form, amount: Number(form.amount) });
        reset();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--text-muted)", marginBottom: 4 }}>
                            {editData ? "EDIT" : "NEW"} TRANSACTION
                        </div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--neon-cyan)", textShadow: "0 0 10px rgba(0,212,255,0.5)" }}>
                            {editData ? "Update Expense" : "Add Expense"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}
                    >✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="label">Title</label>
                        <input
                            className={`input ${errors.title ? "input-error" : ""}`}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="What did you spend on?"
                        />
                        {errors.title && <div className="error-msg">{errors.title}</div>}
                    </div>

                    {/* Amount + Date */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label className="label">Amount (₹)</label>
                            <input
                                className={`input ${errors.amount ? "input-error" : ""}`}
                                name="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                            {errors.amount && <div className="error-msg">{errors.amount}</div>}
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input
                                className={`input ${errors.date ? "input-error" : ""}`}
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                            />
                            {errors.date && <div className="error-msg">{errors.date}</div>}
                        </div>
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="label">Category</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: "category", value: cat.id } })}
                                    style={{
                                        padding: "0.5rem 0.25rem",
                                        borderRadius: 8,
                                        border: `1px solid ${form.category === cat.id ? cat.color : "var(--border)"}`,
                                        background: form.category === cat.id ? `${cat.color}20` : "transparent",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.2s",
                                        color: form.category === cat.id ? cat.color : "var(--text-muted)",
                                        boxShadow: form.category === cat.id ? `0 0 10px ${cat.color}40` : "none"
                                    }}
                                >
                                    <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
                                    <span style={{ fontSize: "0.55rem", fontFamily: "var(--font-display)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                        {cat.label.split(" ")[0]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label className="label">Note (Optional)</label>
                        <input
                            className="input"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Any extra details..."
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {editData ? "Update" : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
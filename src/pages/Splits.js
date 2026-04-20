// src/pages/Splits.js
import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const SplitModal = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState({
        title: "",
        totalAmount: "",
        people: "",
        date: format(new Date(), "yyyy-MM-dd"),
        note: "",
        paidBy: "me"
    });
    const [errors, setErrors] = useState({});

    const handleChange = e => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
        setErrors(p => ({ ...p, [e.target.name]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.title.trim()) errs.title = "Required";
        if (!form.totalAmount || isNaN(form.totalAmount) || Number(form.totalAmount) <= 0) errs.totalAmount = "Enter valid amount";
        if (!form.people.trim()) errs.people = "Required";
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        const peopleList = form.people.split(",").map(p => p.trim()).filter(Boolean);
        const perPerson = (Number(form.totalAmount) / (peopleList.length + 1)).toFixed(2);
        onSubmit({
            ...form,
            totalAmount: Number(form.totalAmount),
            peopleList,
            perPerson: Number(perPerson),
            settled: [],
            status: "pending"
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--neon-purple)", textShadow: "0 0 10px rgba(179,68,255,0.5)" }}>
                        New Split
                    </h2>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="label">What was it for?</label>
                        <input className={`input ${errors.title ? "input-error" : ""}`} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Dinner at CCD" />
                        {errors.title && <div className="error-msg">{errors.title}</div>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                            <label className="label">Total Amount (₹)</label>
                            <input className={`input ${errors.totalAmount ? "input-error" : ""}`} name="totalAmount" type="number" value={form.totalAmount} onChange={handleChange} placeholder="0.00" />
                            {errors.totalAmount && <div className="error-msg">{errors.totalAmount}</div>}
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input className="input" name="date" type="date" value={form.date} onChange={handleChange} />
                        </div>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="label">People (comma separated)</label>
                        <input className={`input ${errors.people ? "input-error" : ""}`} name="people" value={form.people} onChange={handleChange} placeholder="Rohan, Priya, Arjun" />
                        {errors.people && <div className="error-msg">{errors.people}</div>}
                        {form.totalAmount && form.people && (
                            <div style={{ marginTop: "0.4rem", fontSize: "0.8rem", color: "var(--neon-green)" }}>
                                Each owes: ₹{(Number(form.totalAmount) / (form.people.split(",").filter(Boolean).length + 1)).toFixed(2)}
                            </div>
                        )}
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label className="label">Paid by</label>
                        <select className="input" name="paidBy" value={form.paidBy} onChange={handleChange}>
                            <option value="me">Me</option>
                            {form.people.split(",").map(p => p.trim()).filter(Boolean).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ background: "linear-gradient(135deg, var(--neon-purple), #6600cc)", boxShadow: "0 0 15px rgba(179,68,255,0.4)" }}>
                            Add Split
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Splits = () => {
    const { splits, createSplit, editSplit, removeSplit } = useFinance();
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (data) => {
        await createSplit(data);
        toast.success("Split added!");
    };

    const toggleSettle = async (split, person) => {
        const settled = split.settled || [];
        const newSettled = settled.includes(person)
            ? settled.filter(p => p !== person)
            : [...settled, person];
        await editSplit(split.id, { settled: newSettled });
        toast.success(settled.includes(person) ? "Marked unsettled" : `${person} settled up!`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this split?")) return;
        await removeSplit(id);
        toast.success("Deleted");
    };

    const totalOwed = splits.reduce((s, sp) => {
        const unsettled = (sp.peopleList || []).filter(p => !(sp.settled || []).includes(p));
        return s + unsettled.length * Number(sp.perPerson || 0);
    }, 0);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 className="page-title">Expense Splits</h1>
                    <p className="page-subtitle">Track who owes what from shared expenses</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, var(--neon-purple), #6600cc)", boxShadow: "0 0 15px rgba(179,68,255,0.4)" }}>
                    + NEW SPLIT
                </button>
            </div>

            {totalOwed > 0 && (
                <div className="card" style={{ marginBottom: "1.5rem", borderColor: "rgba(179,68,255,0.3)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: "0.3rem" }}>TOTAL OUTSTANDING</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--neon-purple)", textShadow: "0 0 15px rgba(179,68,255,0.5)" }}>
                        ₹{totalOwed.toLocaleString("en-IN")}
                    </div>
                </div>
            )}

            {splits.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No splits yet. Add a shared expense to get started.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {splits.map(split => {
                        const settled = split.settled || [];
                        const peopleList = split.peopleList || [];
                        const allSettled = peopleList.length > 0 && peopleList.every(p => settled.includes(p));

                        return (
                            <div key={split.id} className="card" style={{ borderColor: allSettled ? "rgba(0,255,136,0.2)" : "var(--border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <div>
                                        <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>{split.title}</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                                            {split.date} · Paid by <span style={{ color: "var(--neon-cyan)" }}>{split.paidBy || "Me"}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--neon-purple)" }}>
                                            ₹{Number(split.totalAmount).toLocaleString("en-IN")}
                                        </div>
                                        {allSettled && (
                                            <span style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", color: "var(--neon-green)", borderRadius: 20, padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontFamily: "var(--font-display)" }}>
                                                SETTLED
                                            </span>
                                        )}
                                        <button onClick={() => handleDelete(split.id)} style={{
                                            background: "none", border: "none", cursor: "pointer",
                                            color: "var(--text-muted)", fontSize: "1rem", padding: "0.2rem"
                                        }}>✕</button>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    {peopleList.map(person => {
                                        const isSettled = settled.includes(person);
                                        return (
                                            <button
                                                key={person}
                                                onClick={() => toggleSettle(split, person)}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: "0.4rem",
                                                    padding: "0.4rem 0.8rem", borderRadius: 20, cursor: "pointer",
                                                    border: `1px solid ${isSettled ? "rgba(0,255,136,0.4)" : "rgba(179,68,255,0.4)"}`,
                                                    background: isSettled ? "rgba(0,255,136,0.08)" : "rgba(179,68,255,0.08)",
                                                    color: isSettled ? "var(--neon-green)" : "var(--neon-purple)",
                                                    fontSize: "0.8rem", transition: "all 0.2s"
                                                }}
                                            >
                                                <span>{isSettled ? "✓" : "○"}</span>
                                                <span>{person}</span>
                                                <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>₹{split.perPerson}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && <SplitModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />}
        </div>
    );
};

export default Splits;
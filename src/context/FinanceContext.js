// src/context/FinanceContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import {
    getExpenses, addExpense, updateExpense, deleteExpense,
    getBudget, setBudget,
    getSplits, addSplit, updateSplit, deleteSplit
} from "../services/expenseService";
import { format } from "date-fns";

const FinanceContext = createContext();

export const useFinance = () => {
    const ctx = useContext(FinanceContext);
    if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
    return ctx;
};

export const CATEGORIES = [
    { id: "food", label: "Food & Dining", icon: "🍜", color: "#ff6b6b" },
    { id: "travel", label: "Travel", icon: "🚌", color: "#4ecdc4" },
    { id: "subscriptions", label: "Subscriptions", icon: "📱", color: "#a855f7" },
    { id: "stationery", label: "Stationery", icon: "📚", color: "#f59e0b" },
    { id: "hostel", label: "Hostel/Rent", icon: "🏠", color: "#3b82f6" },
    { id: "health", label: "Health", icon: "💊", color: "#10b981" },
    { id: "entertainment", label: "Entertainment", icon: "🎮", color: "#ec4899" },
    { id: "other", label: "Other", icon: "💸", color: "#6b7280" }
];

export const FinanceProvider = ({ children }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [splits, setSplits] = useState([]);
    const [budgets, setBudgets] = useState({});
    const [currentMonth, setCurrentMonth] = useState(format(new Date(), "yyyy-MM"));
    const [loading, setLoading] = useState(true);

    // Fetch all data when user changes
    useEffect(() => {
        if (!user) { setLoading(false); return; }
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [expData, splitData, budgetData] = await Promise.all([
                    getExpenses(user.uid),
                    getSplits(user.uid),
                    getBudget(user.uid, currentMonth)
                ]);
                setExpenses(expData);
                setSplits(splitData);
                setBudgets(budgetData?.budgets || {});
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [user, currentMonth]);

    // ── Expenses ──────────────────────────────────────────────────────────────
    const createExpense = useCallback(async (data) => {
        const id = await addExpense(user.uid, data);
        setExpenses(prev => [{ id, ...data, userId: user.uid }, ...prev]);
    }, [user]);

    const editExpense = useCallback(async (id, data) => {
        await updateExpense(id, data);
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    }, []);

    const removeExpense = useCallback(async (id) => {
        await deleteExpense(id);
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    // ── Budgets ───────────────────────────────────────────────────────────────
    const saveBudgets = useCallback(async (newBudgets) => {
        await setBudget(user.uid, currentMonth, newBudgets);
        setBudgets(newBudgets);
    }, [user, currentMonth]);

    // ── Splits ────────────────────────────────────────────────────────────────
    const createSplit = useCallback(async (data) => {
        const id = await addSplit(user.uid, data);
        setSplits(prev => [{ id, ...data, userId: user.uid }, ...prev]);
    }, [user]);

    const editSplit = useCallback(async (id, data) => {
        await updateSplit(id, data);
        setSplits(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    }, []);

    const removeSplit = useCallback(async (id) => {
        await deleteSplit(id);
        setSplits(prev => prev.filter(s => s.id !== id));
    }, []);

    // ── Derived / memoized data ───────────────────────────────────────────────
    const monthExpenses = useMemo(() =>
        expenses.filter(e => e.date?.startsWith(currentMonth)),
        [expenses, currentMonth]
    );

    const totalSpent = useMemo(() =>
        monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
        [monthExpenses]
    );

    const totalBudget = useMemo(() =>
        Object.values(budgets).reduce((sum, v) => sum + Number(v || 0), 0),
        [budgets]
    );

    const spendingByCategory = useMemo(() => {
        const map = {};
        monthExpenses.forEach(e => {
            map[e.category] = (map[e.category] || 0) + Number(e.amount);
        });
        return map;
    }, [monthExpenses]);

    const budgetAlerts = useMemo(() => {
        return CATEGORIES.filter(cat => {
            const spent = spendingByCategory[cat.id] || 0;
            const budget = budgets[cat.id];
            return budget && spent >= budget * 0.8;
        });
    }, [spendingByCategory, budgets]);

    return (
        <FinanceContext.Provider value={{
            expenses, monthExpenses, splits, budgets, currentMonth,
            loading, totalSpent, totalBudget, spendingByCategory, budgetAlerts,
            setCurrentMonth,
            createExpense, editExpense, removeExpense,
            saveBudgets,
            createSplit, editSplit, removeSplit
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
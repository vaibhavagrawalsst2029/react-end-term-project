// src/hooks/useExpenseForm.js
import { useState, useCallback } from "react";
import { format } from "date-fns";

const INITIAL = {
    title: "",
    amount: "",
    category: "food",
    date: format(new Date(), "yyyy-MM-dd"),
    note: ""
};

export const useExpenseForm = (initial = INITIAL) => {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    }, []);

    const validate = useCallback(() => {
        const errs = {};
        if (!form.title.trim()) errs.title = "Title is required";
        if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
            errs.amount = "Enter a valid amount";
        if (!form.date) errs.date = "Date is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [form]);

    const reset = useCallback(() => {
        setForm(INITIAL);
        setErrors({});
    }, []);

    return { form, setForm, errors, handleChange, validate, reset };
};

// src/hooks/useLocalStorage.js is also included below as named export
export const useLocalStorage = (key, initial) => {
    const [value, setValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initial;
        } catch { return initial; }
    });

    const set = useCallback((v) => {
        setValue(v);
        localStorage.setItem(key, JSON.stringify(v));
    }, [key]);

    return [value, set];
};
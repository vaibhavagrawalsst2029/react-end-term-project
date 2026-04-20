// src/services/expenseService.js
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "expenses";

// CREATE
export const addExpense = async (userId, expenseData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...expenseData,
        userId,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

// READ - get all expenses for a user
export const getExpenses = async (userId) => {
    const q = query(
        collection(db, COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// UPDATE
export const updateExpense = async (expenseId, updatedData) => {
    const ref = doc(db, COLLECTION, expenseId);
    await updateDoc(ref, updatedData);
};

// DELETE
export const deleteExpense = async (expenseId) => {
    await deleteDoc(doc(db, COLLECTION, expenseId));
};

// ── Budget CRUD ──────────────────────────────────────────────────────────────
const BUDGET_COLLECTION = "budgets";

export const setBudget = async (userId, month, budgets) => {
    // month format: "2025-03"
    const q = query(
        collection(db, BUDGET_COLLECTION),
        where("userId", "==", userId),
        where("month", "==", month)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        await addDoc(collection(db, BUDGET_COLLECTION), { userId, month, budgets, updatedAt: serverTimestamp() });
    } else {
        const ref = doc(db, BUDGET_COLLECTION, snapshot.docs[0].id);
        await updateDoc(ref, { budgets, updatedAt: serverTimestamp() });
    }
};

export const getBudget = async (userId, month) => {
    const q = query(
        collection(db, BUDGET_COLLECTION),
        where("userId", "==", userId),
        where("month", "==", month)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

// ── Split Expenses ────────────────────────────────────────────────────────────
const SPLITS_COLLECTION = "splits";

export const addSplit = async (userId, splitData) => {
    const docRef = await addDoc(collection(db, SPLITS_COLLECTION), {
        ...splitData,
        userId,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getSplits = async (userId) => {
    const q = query(
        collection(db, SPLITS_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateSplit = async (splitId, data) => {
    await updateDoc(doc(db, SPLITS_COLLECTION, splitId), data);
};

export const deleteSplit = async (splitId) => {
    await deleteDoc(doc(db, SPLITS_COLLECTION, splitId));
};
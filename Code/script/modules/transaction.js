import { load, save } from "./storage.js";

export function save_transaction(transactionObject) {
    const user = load();

    if (user && user.session.isLoggedIn) {
        if (!Array.isArray(user.transactions)) {
            user.transactions = [];
        }

        if (!transactionObject.date) {
            transactionObject.date = new Date().toISOString();
        }

        user.transactions.unshift(transactionObject);
        save(user);
        console.log("Transaction saved");
    } else {
        console.log("Cannot save transaction, user not logged in.");
    }
}

export function get_transactions() {
    const user = load();
    if (user && user.session.isLoggedIn && Array.isArray(user.transactions)) {
        return user.transactions;
    }
    return [];
}
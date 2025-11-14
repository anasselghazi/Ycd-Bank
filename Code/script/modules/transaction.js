import { load, save } from "./storage.js";

function addTransaction(user, trans) {
    if (!user.transactions) {
        user.transactions = [];
    }

    const newTrans = {
        type: trans.type ? trans.type : "add",
        amount: Number(trans.amount) || 0,
        description: trans.description ? trans.description : "Transaction",
        account: trans.account ? trans.account : "courant",
        date: trans.date ? trans.date : new Date().toISOString()
    };

    user.transactions.unshift(newTrans);
    return newTrans;
}

export function save_transaction(trans) {
    const user = load();

    if (user && user.session && user.session.isLoggedIn) {
        const t = addTransaction(user, trans);
        save(user);
        return t;
    }

    return null;
}

export function get_transactions() {
    const user = load();

    if (user && user.session && user.session.isLoggedIn) {
        if (user.transactions) {
            return user.transactions;
        }
    }

    return [];
}

export function makeTransfer(type, amount, description, options) {
    const user = load();

    if (!user || !user.session || !user.session.isLoggedIn) {
        return null;
    }

    let accountName = "courant";
    if (options && options.accountType === "epargne") {
        accountName = "epargne";
    }

    const account = user.accounts[accountName];
    if (!account) {
        return null;
    }

    const money = Number(amount);
    if (!money || money <= 0) {
        return null;
    }

    let transType = "add";
    if (type === "expense") {
        transType = "expense";
    }

    let finalAmount = money;
    if (transType === "expense") {
        finalAmount = -money;
    }

    account.balance = account.balance + finalAmount;

    let text = "Transaction";
    if (description && description.trim() !== "") {
        text = description.trim();
    } else {
        if (transType === "expense") text = "Expense";
        else text = "Deposit";
    }

    const t = addTransaction(user, {
        type: transType,
        amount: finalAmount,
        description: text,
        account: accountName
    });

    save(user);
    return t;
}

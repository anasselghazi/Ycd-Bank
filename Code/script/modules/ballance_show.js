import { load } from "./storage.js";

let isVisible = false;

export function toggleBalance(displayEl, buttonEl) {
    const user = load();
    if (!user || user.session.isLoggedIn == false) {
        console.log("you are not connected");
        return;
    }

    isVisible = !isVisible; 

    if (isVisible) {
        displayEl.textContent = `$${user.accounts.courant.balance}`;
        buttonEl.textContent = "";
        console.log("balance shown");
    } else {
        displayEl.textContent = "$ *** ***";
        buttonEl.textContent = "";
        console.log("balance hidden");
    }
}

export function initBalanceView(displayEl, buttonEl) {
     const user = load();
     if (user && user.session.isLoggedIn) {
        isVisible = false; 
        displayEl.textContent = "$ *** ***";
        buttonEl.textContent = "";
        buttonEl.hidden = false;
     } else {
        displayEl.textContent = "";
        buttonEl.hidden = true;
     }
}
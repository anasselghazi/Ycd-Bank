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
        displayEl.textContent = `${user.accounts.courant.balance} MAD`;
        buttonEl.textContent = "Masquer";
        console.log("balance shown");
    } else {
        displayEl.textContent = "$ *** ***";
        buttonEl.textContent = "Afficher";
        console.log("balance hidden");
    }
}

export function initBalanceView(displayEl, buttonEl) {
     const user = load();
     if (user && user.session.isLoggedIn) {
        isVisible = false; 
        displayEl.textContent = "*** *** MAD";
        buttonEl.textContent = "Afficher";
        buttonEl.hidden = false;
     } else {
        displayEl.textContent = "";
        buttonEl.hidden = true;
     }
}
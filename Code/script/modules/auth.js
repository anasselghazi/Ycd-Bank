import { createAccount, generaterib, generatecard_number } from "./user.js";
import { load, save, findUserByEmail } from "./storage.js";

// register function

export function register(email, password, fullname, tel, cin) {
    const existing = findUserByEmail(email);

    if (existing) {
        console.log("Account already exists for this email.");
        return false;
    }

    const newAccount = createAccount();
    newAccount.user = { email, password, fullname, tel, cin };
    newAccount.accounts.courant.rib = generaterib();
    newAccount.accounts.epargne.rib = generaterib();
    newAccount.card.number = generatecard_number();
    newAccount.session.isLoggedIn = true;

    save(newAccount);
    console.log("acc created");
    console.log(newAccount);

    if (typeof window !== "undefined") {
        window.location.href = "http://127.0.0.1:5501/Code/pages/dashboard/dashboard.html";
    }

    return true;
}

// login function 

export function login(email, password) {
    const user = findUserByEmail(email);

    if (user && user.user.password === password) {
        console.log("login succ");
        user.session.isLoggedIn = true;
        console.log(user);
        save(user);

        if (typeof window !== "undefined") {
            window.location.href = "http://127.0.0.1:5501/Code/pages/dashboard/dashboard.html";
        }
        return true;
    }

    console.log("Problem");
    return false;
}

export function disconnect() {
    const user = load();

    if (!user) return;

    user.session.isLoggedIn = false;
    save(user);

    if (typeof window !== "undefined") {
        window.location.href = "http://127.0.0.1:5501/Code/auth/login.html";
    }

}


export function checklogin() {
    const user = load();
    if (!user || !user.session || !user.session.isLoggedIn) {
        console.log("you are not logged in ");
        return false;
    }
    else {
        console.log("you are logged in ");
        return true;
    }
}


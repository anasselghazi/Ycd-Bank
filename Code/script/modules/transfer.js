import { KEY, load, save } from "./storage.js";

export function transfer(){
    const user = load();
    let money_reduced = 200;
    if(user.session.isLoggedIn == false){
        console.log("you are not connected");
        console.log(user.session.isLoggedIn);
    }
    else{
        user.accounts.courant.balance -= money_reduced;
        console.log(`${money_reduced} is reduced from your account`);
        save(user);

    }
}
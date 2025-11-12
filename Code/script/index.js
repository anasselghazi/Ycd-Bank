import { register,login } from "./modules/auth.js";
const signuppage=document.getElementById("signupPage");
const signupform=document.getElementById("signupform");
const fullname= document.querySelector(".name");
const email=document.querySelector(".email");
const cin=document.querySelector(".cin");
const numero=document.querySelector(".phone");
const passwordForm = document.getElementById('passwordForm');
const password = document.getElementById('password');
const selectCard=document.getElementById('selectedcard');
const gender =document.getElementById('gender');
const buttoncree = document.getElementById("cree");
const pagelogin=document.getElementById('loginPage');
const formlogin=document.getElementById('loginForm')
const buttonconnecter=document.getElementById("connecter");
buttoncree.addEventListener("click", (e) => {
    register(
        email.value,
        password.value,
        fullname.value,
        numero.value,
        cin.value,
        gender.value,
        selectCard.value
    );
});
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        login(email, password);
    
});
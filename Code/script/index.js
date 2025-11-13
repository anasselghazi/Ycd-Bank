import { register, login } from "./modules/auth.js";
import {
    validateSingleSignupField,
    validateCivilite,
    validatePassword,
    validatePasswordMatch,
    displayError,
    isFieldRequired,
    isValid
} from './modules/validation.js';
import './modules/devices.js';
import { convertWithAPI, formatResult } from './conversion.js';
const signuppage = document.getElementById("signupPage");
const signupform = document.getElementById("signupForm"); // Make sure ID matches HTML
const fullname = document.getElementById("name"); // use ID to avoid ambiguity
const email = document.getElementById("email");
const cin = document.getElementById("cin");
const numero = document.getElementById("phone");
const passwordForm = document.getElementById('passwordForm');
const password = document.getElementById('password');
const selectCard = document.getElementById('selectedcard');
const gender = document.getElementById('gender'); 
const buttoncree = document.getElementById("cree");
const pagelogin = document.getElementById('loginPage');
const formlogin = document.getElementById('loginForm');
const buttonconnecter = document.getElementById("connecter");


buttoncree.addEventListener("click", (e) => {
    e.preventDefault();

    let valid = true;

    if (!validateSingleSignupField(fullname)) valid = false;
    if (!validateSingleSignupField(cin)) valid = false;
    if (!validateSingleSignupField(email)) valid = false;
    if (!validateSingleSignupField(numero)) valid = false;
    if (!validateCivilite()) valid = false;
    if (!selectCard.value) {
        alert("Veuillez sélectionner une carte");
        valid = false;
    }
    if (!gender.value) {
        alert("Veuillez sélectionner votre civilité");
        valid = false;
    }

    if (valid) {
        register(
            email.value,
            password.value,
            fullname.value,
            numero.value,
            cin.value,
            gender.value,
            selectCard.value
        );
        alert("Compte créé avec succès !");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = loginForm.email.value;
        const passwordValue = loginForm.password.value;
        login(emailValue, passwordValue);
    });
});


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

import { register } from "./modules/auth.js";

const fullname = document.getElementById("name");
const email = document.getElementById("email");
const cin = document.getElementById("cin");
const numero = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const buttonCree = document.getElementById("cree");
const goToLoginBtn = document.getElementById("goToLogin");

localStorage.clear();

function getSelectedGender() {
  const selected = document.querySelector('input[name="civilite"]:checked');
  return selected ? selected.value : null;
}

let selectedCard = null;
const blueCard = document.getElementById("blueCard");
const pinkCard = document.getElementById("pinkCard");

if (blueCard) {
  blueCard.addEventListener("click", () => (selectedCard = "Blue"));
}

if (pinkCard) {
  pinkCard.addEventListener("click", () => (selectedCard = "Pink"));
}

if (goToLoginBtn) {
  goToLoginBtn.addEventListener("click", () => {
    window.location.href = "../login.html";
  });
}

if (buttonCree) {
  buttonCree.addEventListener("click", function (e) {
    e.preventDefault();

    const gender = getSelectedGender();

    if (!fullname.value || !email.value || !cin.value || !numero.value) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    if (!gender || !selectedCard) {
      alert("Veuillez choisir votre civilité et votre carte !");
      return;
    }

    if (!password.value || !confirmPassword.value) {
      alert("Veuillez entrer votre mot de passe !");
      return;
    }

    if (password.value !== confirmPassword.value) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const created = register(
      email.value,
      password.value,
      fullname.value,
      numero.value,
      cin.value,
      gender,
      selectedCard
    );

    if (created) {
      alert("Compte créé avec succès !");
      window.location.href = "../../pages/dashboard/dashboard.html";
      return;
    }

    alert("Un compte existe déjà avec cet email.");
  });
}

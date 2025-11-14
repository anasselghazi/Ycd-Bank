import { login } from "./modules/auth.js";

const loginForm = document.getElementById("loginForm");
const goToSignupBtn = document.getElementById("goToSignup");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginForm.elements.email?.value?.trim() || "";
    const password = loginForm.elements.password?.value || "";

    if (!email || !password) {
      alert("Veuillez saisir votre email et votre mot de passe.");
      return;
    }

    const success = login(email, password);

    if (success) {
      window.location.href = "../pages/dashboard/dashboard.html";
      return;
    }

    alert("Email ou mot de passe incorrect.");
  });
}

if (goToSignupBtn) {
  goToSignupBtn.addEventListener("click", () => {
    window.location.href = "./Register/register.html";
  });
}

import { load } from "./storage.js";
import { disconnect } from "./auth.js";

document.addEventListener("DOMContentLoaded", function() {

    const sidebarUserName = document.getElementById("sidebar-user-name");
    const sidebarUserEmail = document.getElementById("sidebar-user-email");
    const disconnectLinkSidebar = document.getElementById("disconnect-link-sidebar");

    const selectAccountBtn = document.getElementById("select-account-btn");
    const selectedAccountName = document.getElementById("selected-account-name");
    const selectedAccountBalance = document.getElementById("selected-account-balance");
    const selectedAccountIcon = document.getElementById("selected-account-icon");

    const accountModal = document.getElementById("account-select-modal");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const closeModalBtn = document.getElementById("close-modal-btn");
    
    const selectCourantBtn = document.getElementById("select-courant-btn");
    const selectEpargneBtn = document.getElementById("select-epargne-btn");

    const modalCourantBalance = document.getElementById("modal-courant-balance");
    const modalEpargneBalance = document.getElementById("modal-epargne-balance");

    let selectedAccount = "courant"; 
    const user = load();

    if (user && user.session.isLoggedIn) {
        console.log("User logged in");
        if (user.user) {
            const upperCaseName = user.user.fullname ? user.user.fullname.toUpperCase() : "UTILISATEUR";
            if (sidebarUserName) sidebarUserName.textContent = upperCaseName;
            if (sidebarUserEmail) sidebarUserEmail.textContent = user.user.email || "email.non.fourni@exemple.com";
        }

        if (disconnectLinkSidebar) {
            disconnectLinkSidebar.addEventListener("click", function(e) {
                e.preventDefault();
                disconnect();
            });
        }
        
        updateAccountBalances(user);
        updateSelectedAccountDisplay();

    } else {
        console.log("User not logged in");
        window.location.href = "../../auth/login.html";
    }

    function updateAccountBalances(user) {
        if (user && user.accounts) {
            if (modalCourantBalance) {
                modalCourantBalance.textContent = `Solde: $${user.accounts.courant?.balance || 0}`;
            }
            if (modalEpargneBalance) {
                modalEpargneBalance.textContent = `Solde: $${user.accounts.epargne?.balance || 0}`;
            }
        }
    }
    function updateSelectedAccountDisplay() {
        if (!user || !user.accounts) return;

        if (selectedAccount === "courant") {
            if (selectedAccountName) selectedAccountName.textContent = "Compte Courant";
            if (selectedAccountBalance) selectedAccountBalance.textContent = `Solde disponible : $${user.accounts.courant?.balance || 0}`;
            if (selectedAccountIcon) selectedAccountIcon.textContent = "account_balance_wallet";
            
            if (selectCourantBtn) selectCourantBtn.classList.add("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-300");
            if (selectEpargneBtn) selectEpargneBtn.classList.remove("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-300");
        } else if (selectedAccount === "epargne") {
            if (selectedAccountName) selectedAccountName.textContent = "Compte Épargne";
            if (selectedAccountBalance) selectedAccountBalance.textContent = `Solde disponible : $${user.accounts.epargne?.balance || 0}`;
            if (selectedAccountIcon) selectedAccountIcon.textContent = "savings";

            if (selectCourantBtn) selectCourantBtn.classList.remove("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-300");
            if (selectEpargneBtn) selectEpargneBtn.classList.add("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-300");
        }
    }

    function showModal() {
        if (accountModal) {
            accountModal.classList.remove("hidden");
            accountModal.classList.add("flex");
        }
    }

    function hideModal() {
        if (accountModal) {
            accountModal.classList.add("hidden");
            accountModal.classList.remove("flex");
        }
    }

    if (selectAccountBtn) {
        selectAccountBtn.addEventListener("click", showModal);
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", hideModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", hideModal);
    }

    if (selectCourantBtn) {
        selectCourantBtn.addEventListener("click", () => {
            selectedAccount = "courant";
            updateSelectedAccountDisplay();
            hideModal();
        });
    }

    if (selectEpargneBtn) {
        selectEpargneBtn.addEventListener("click", () => {
            selectedAccount = "epargne";
            updateSelectedAccountDisplay();
            hideModal();
        });
    }
});
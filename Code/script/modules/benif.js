import { load, save } from "./storage.js";
import { disconnect } from "./auth.js";

export function addbenif(name, rib) {
    const user = load();

    if (user && user.session.isLoggedIn) {
        if (!Array.isArray(user.beneficiaries)) {
            user.beneficiaries = [];
        }

        const existing = user.beneficiaries.find(b => b.rib === rib);
        if (existing) {
            console.log("Beneficiary with this RIB already exists.");
            alert("Un bénéficiaire avec ce RIB existe déjà.");
            return;
        }

        user.beneficiaries.push({ 
            name: name, 
            rib: rib,
            added: new Date().toISOString()
        });
        save(user);
        console.log(`Beneficiary added: ${name} (${rib})`);
        location.reload();
    } else {
        console.log("You must log in first.");
    }
}

function displayBeneficiaries(benefs, gridElement) {
    if (!gridElement) return;
    gridElement.innerHTML = "";

    if (!benefs || benefs.length === 0) {
        gridElement.innerHTML = '<p class="text-gray-500 lg:col-span-2 text-center py-4">Aucun bénéficiaire trouvé.</p>';
        return;
    }

    benefs.forEach(benif => {
        const name = benif.name || "Sans Nom";
        const rib = benif.rib || "RIB INCONNU";
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            
        const addedDate = benif.added || "2025-01-01T00:00:00.000Z";

        const cardHtml = `
        <div class="beneficiary-card rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between"
             data-name="${name}" data-added="${addedDate}">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="h-10 w-10 rounded-full bg-[#0A2A4E] text-white grid place-items-center text-[13px] font-extrabold shrink-0">${initials}</div>
            <div class="overflow-hidden">
              <p class="text-[15px] font-semibold truncate" title="${name}">${name}</p>
              <p class="text-[12px] text-[#64748B]">${rib}</p>
            </div>
          </div>
          <button class="h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F1F5F9] shrink-0" data-rib="${rib}">
            <span class="material-symbols-outlined text-[#64748B]">more_vert</span>
          </button>
        </div>
        `;
        gridElement.innerHTML += cardHtml;
    });
}

function displayError(inputElement, errorElement, message) {
    if (message) {
        if (inputElement) inputElement.classList.add('input-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    } else {
        if (inputElement) inputElement.classList.remove('input-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

    const addBenifBtn = document.getElementById("addBenifBtn");
    const addBenifModal = document.getElementById("addBenifModal");
    const addBenifForm = document.getElementById("addBenifForm");
    
    const benifNameInput = document.getElementById("benif-name");
    const benifRibInput = document.getElementById("benif-rib");
    const benifNameError = document.getElementById("benif-nameError");
    const benifRibError = document.getElementById("benif-ribError");
    
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');

    const sidebarUserName = document.getElementById("sidebar-user-name");
    const sidebarUserEmail = document.getElementById("sidebar-user-email");
    const disconnectLinkSidebar = document.getElementById("disconnect-link-sidebar");

    const benefGrid = document.getElementById("benefGrid");
    const searchInput = document.getElementById("searchBenef");

    const user = load();
    let currentBeneficiaries = (user && user.beneficiaries) ? [...user.beneficiaries] : [];

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
        
    } else {
        console.log("User not logged in or session expired.");
        if (typeof window !== "undefined") {
            window.location.href = "../../auth/login.html";
        }
        return;
    }

    function showModal() {
        if (addBenifModal) {
            addBenifModal.classList.remove("hidden");
            addBenifModal.classList.add("flex");
        }
    }

    function hideModal() {
        if (addBenifModal) {
            addBenifModal.classList.remove("flex");
            addBenifModal.classList.add("hidden");
            if (addBenifForm) addBenifForm.reset();
            displayError(benifNameInput, benifNameError, null);
            displayError(benifRibInput, benifRibError, null);
        }
    }

    if (addBenifBtn) {
        addBenifBtn.addEventListener("click", showModal);
    }

    closeButtons.forEach(button => {
        button.addEventListener("click", hideModal);
    });

    if (addBenifForm) {
        addBenifForm.addEventListener("submit", function(e) {
            e.preventDefault();
            console.log("Form submitted");
            
            let isValid = true;
            const name = benifNameInput.value;
            const rib = benifRibInput.value.replace(/[\s-]/g, '').toUpperCase();

            if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
                displayError(benifNameInput, benifNameError, "Nom invalide (lettres et espaces, 2-50).");
                isValid = false;
            } else {
                displayError(benifNameInput, benifNameError, null);
            }

            if (!/^[A-Z0-9]{10,34}$/.test(rib)) {
                displayError(benifRibInput, benifRibError, "RIB/IBAN invalide (10-34 chiffres/lettres).");
                isValid = false;
            } else {
                displayError(benifRibInput, benifRibError, null);
            }

            if (isValid) {
                console.log("Form is valid");
                addbenif(name, rib);
            } else {
                console.log("Form is invalid");
            }
        });
    }

    function updateDisplay() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

        let benefs = [...currentBeneficiaries];

        if (searchTerm) {
            benefs = benefs.filter(b => 
                (b.name && b.name.toLowerCase().includes(searchTerm)) ||
                (b.rib && b.rib.toLowerCase().includes(searchTerm))
            );
        }
        
        displayBeneficiaries(benefs, benefGrid);
    }

    if (searchInput) {
        searchInput.addEventListener("input", updateDisplay);
    }

    updateDisplay();

});
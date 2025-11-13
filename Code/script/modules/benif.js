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

export function deletebenif(rib) {
    const user = load();
    if (!user || !user.session.isLoggedIn) {
        console.log("Cannot delete, user not logged in.");
        return;
    }

    if (user.beneficiaries) {
        user.beneficiaries = user.beneficiaries.filter(b => b.rib !== rib);
        save(user);
        console.log(`Beneficiary deleted: ${rib}`);
        location.reload();
    } else {
        console.log("No beneficiaries array found to delete from.");
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
          <button class="delete-benif-btn h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F1F5F9] shrink-0" data-rib="${rib}">
            <span class="material-symbols-outlined text-[#F43F5E]">delete</span>
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

    const deleteBenifModal = document.getElementById("deleteBenifModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtns = document.querySelectorAll('[data-dismiss="modal-delete"]');
    let ribToDelete = null;

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
        console.log("User not logged in");
        window.location.href = "../../auth/login.html";
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

    function showDeleteModal(rib) {
        ribToDelete = rib;
        if (deleteBenifModal) {
            deleteBenifModal.classList.remove("hidden");
            deleteBenifModal.classList.add("flex");
        }
    }

    function hideDeleteModal() {
        ribToDelete = null;
        if (deleteBenifModal) {
            deleteBenifModal.classList.remove("flex");
            deleteBenifModal.classList.add("hidden");
        }
    }

    if (addBenifBtn) {
        addBenifBtn.addEventListener("click", showModal);
    }

    closeButtons.forEach(button => {
        button.addEventListener("click", hideModal);
    });

    cancelDeleteBtns.forEach(button => {
        button.addEventListener("click", hideDeleteModal);
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (ribToDelete) {
                deletebenif(ribToDelete);
            }
            hideDeleteModal();
        });
    }

    if (addBenifForm) {
        addBenifForm.addEventListener("submit", function(e) {
            e.preventDefault();
            console.log("Form submitted");
            
            const name = benifNameInput.value;
            const rib = benifRibInput.value.replace(/[\s-]/g, '').toUpperCase();

            if (name && rib) {
                console.log("Form is valid");
                addbenif(name, rib);
            } else {
                console.log("Form is invalid");
                alert("Veuillez remplir le nom et le RIB.");
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

        document.querySelectorAll('.delete-benif-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const rib = e.currentTarget.getAttribute('data-rib');
                if (rib) {
                    showDeleteModal(rib);
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", updateDisplay);
    }

    updateDisplay();

});
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
            added: new Date().toISOString(),
            isBlocked: false 
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

export function blockbenif(rib) {
    const user = load();
    if (!user || !user.session.isLoggedIn) return;
    if (user.beneficiaries) {
        const index = user.beneficiaries.findIndex(b => b.rib === rib);
        if (index !== -1) {
            user.beneficiaries[index].isBlocked = true;
            save(user);
            console.log(`Beneficiary blocked: ${rib}`);
            location.reload();
        }
    }
}

export function unblockbenif(rib) {
    const user = load();
    if (!user || !user.session.isLoggedIn) return;
    if (user.beneficiaries) {
        const index = user.beneficiaries.findIndex(b => b.rib === rib);
        if (index !== -1) {
            user.beneficiaries[index].isBlocked = false;
            save(user);
            console.log(`Beneficiary unblocked: ${rib}`);
            location.reload();
        }
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
        
        const isBlocked = benif.isBlocked || false;
        const blockIcon = isBlocked ? "lock_open" : "lock";
        const blockColor = isBlocked ? "text-[#16A34A]" : "text-[#F59E0B]";
        const cardOpacity = isBlocked ? "opacity-50" : "";

        const cardHtml = `
        <div class="beneficiary-card rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between ${cardOpacity}"
             data-name="${name}" data-added="${addedDate}">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="h-10 w-10 rounded-full bg-[#0A2A4E] text-white grid place-items-center text-[13px] font-extrabold shrink-0">${initials}</div>
            <div class="overflow-hidden">
              <p class="text-[15px] font-semibold truncate" title="${name}">${name}</p>
              <p class="text-[12px] text-[#64748B]">${rib}</p>
            </div>
          </div>
          <div class="flex shrink-0">
            <button class="block-benif-btn h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F1F5F9]" data-rib="${rib}" data-blocked="${isBlocked}">
              <span class="material-symbols-outlined ${blockColor}">${blockIcon}</span>
            </button>
            <button class="delete-benif-btn h-9 w-9 grid place-items-center rounded-lg hover:bg-[#F1F5F9]" data-rib="${rib}">
              <span class="material-symbols-outlined text-[#F43F5E]">delete</span>
            </button>
          </div>
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

    let isInternalBeneficiary = false;

    const addBenifBtn = document.getElementById("addBenifBtn");
    const addBenifModal = document.getElementById("addBenifModal");
    const modalStep1 = document.getElementById("modalStep1");
    const modalStep2 = document.getElementById("modalStep2");
    const selectYCD = document.getElementById("selectYCD");
    const selectExternal = document.getElementById("selectExternal");
    const modalBackBtn = document.getElementById("modalBackBtn");
    const addBenifForm = document.getElementById("addBenifForm");
    
    const benifNameInput = document.getElementById("benif-name");
    const benifRibInput = document.getElementById("benif-rib");
    const benifRibLabel = document.getElementById("benif-rib-label");
    const benifNameError = document.getElementById("benif-nameError");
    const benifRibError = document.getElementById("benif-ribError");
    
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');

    const deleteBenifModal = document.getElementById("deleteBenifModal");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtns = document.querySelectorAll('[data-dismiss="modal-delete"]');
    let ribToDelete = null;

    const blockBenifModal = document.getElementById("blockBenifModal");
    const confirmBlockBtn = document.getElementById("confirmBlockBtn");
    const cancelBlockBtns = document.querySelectorAll('[data-dismiss="modal-block"]');
    const blockModalTitle = document.getElementById("blockModalTitle");
    const blockModalText = document.getElementById("blockModalText");
    let ribToToggleBlock = null;
    let willBeBlocked = true;

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
            goToStep(1);
        }
    }

    function hideModal() {
        if (addBenifModal) {
            addBenifModal.classList.remove("flex");
            addBenifModal.classList.add("hidden");
            goToStep(1);
            if (addBenifForm) addBenifForm.reset();
            displayError(benifNameInput, benifNameError, null);
            displayError(benifRibInput, benifRibError, null);
        }
    }

    function goToStep(stepNumber) {
        if (stepNumber === 1) {
            if (modalStep1) modalStep1.classList.remove("hidden");
            if (modalStep2) modalStep2.classList.add("hidden");
        } else if (stepNumber === 2) {
            if (modalStep1) modalStep1.classList.add("hidden");
            if (modalStep2) modalStep2.classList.remove("hidden");
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

    function showBlockModal(rib, isCurrentlyBlocked) {
        ribToToggleBlock = rib;
        willBeBlocked = !isCurrentlyBlocked;

        if (blockBenifModal) {
            if (willBeBlocked) {
                if (blockModalTitle) blockModalTitle.textContent = "Confirmer le blocage";
                if (blockModalText) blockModalText.textContent = "Êtes-vous sûr de vouloir bloquer ce bénéficiaire ?";
                if (confirmBlockBtn) {
                    confirmBlockBtn.textContent = "Bloquer";
                    confirmBlockBtn.classList.remove("bg-[#16A34A]");
                    confirmBlockBtn.classList.add("bg-[#F59E0B]");
                }
            } else {
                if (blockModalTitle) blockModalTitle.textContent = "Confirmer le déblocage";
                if (blockModalText) blockModalText.textContent = "Êtes-vous sûr de vouloir débloquer ce bénéficiaire ?";
                if (confirmBlockBtn) {
                    confirmBlockBtn.textContent = "Débloquer";
                    confirmBlockBtn.classList.remove("bg-[#F59E0B]");
                    confirmBlockBtn.classList.add("bg-[#16A34A]");
                }
            }
            blockBenifModal.classList.remove("hidden");
            blockBenifModal.classList.add("flex");
        }
    }

    function hideBlockModal() {
        ribToToggleBlock = null;
        if (blockBenifModal) {
            blockBenifModal.classList.remove("flex");
            blockBenifModal.classList.add("hidden");
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

    cancelBlockBtns.forEach(button => {
        button.addEventListener("click", hideBlockModal);
    });

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (ribToDelete) {
                deletebenif(ribToDelete);
            }
            hideDeleteModal();
        });
    }

    if (confirmBlockBtn) {
        confirmBlockBtn.addEventListener("click", () => {
            if (ribToToggleBlock) {
                if (willBeBlocked) {
                    blockbenif(ribToToggleBlock);
                } else {
                    unblockbenif(ribToToggleBlock);
                }
            }
            hideBlockModal();
        });
    }

    if (selectYCD) {
        selectYCD.addEventListener("click", () => {
            isInternalBeneficiary = true;
            if (benifRibLabel) benifRibLabel.textContent = "Numéro de compte (16 chiffres)";
            if (benifRibInput) benifRibInput.placeholder = "XXXX XXXX XXXX XXXX";
            goToStep(2);
        });
    }
    
    if (selectExternal) {
        selectExternal.addEventListener("click", () => {
            isInternalBeneficiary = false;
            if (benifRibLabel) benifRibLabel.textContent = "RIB (IBAN)";
            if (benifRibInput) benifRibInput.placeholder = "XXXX XXXX XXXX XXXX XXXX";
            goToStep(2);
        });
    }

    if (modalBackBtn) {
        modalBackBtn.addEventListener("click", () => goToStep(1));
    }

    if (addBenifForm) {
        addBenifForm.addEventListener("submit", function(e) {
            e.preventDefault();
            console.log("Form submitted");
            
            let isValid = true;
            const name = benifNameInput.value;
            const rib = benifRibInput.value.replace(/[\s-]/g, '').toUpperCase();
            let fullRib = rib;

            if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
                displayError(benifNameInput, benifNameError, "Nom invalide (lettres et espaces, 2-50).");
                isValid = false;
            } else {
                displayError(benifNameInput, benifNameError, null);
            }

            if (isInternalBeneficiary) {
                if (!/^\d{16}$/.test(rib)) {
                    displayError(benifRibInput, benifRibError, "Doit contenir 16 chiffres.");
                    isValid = false;
                } else {
                    fullRib = "007041" + rib + "22";
                    displayError(benifRibInput, benifRibError, null);
                }
            } else {
                if (!/^[A-Z0-9]{10,34}$/.test(rib)) {
                    displayError(benifRibInput, benifRibError, "RIB/IBAN invalide (10-34 chiffres/lettres).");
                    isValid = false;
                } else {
                    displayError(benifRibInput, benifRibError, null);
                }
            }

            if (isValid) {
                console.log("Form is valid");
                addbenif(name, fullRib);
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

        document.querySelectorAll('.delete-benif-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const rib = e.currentTarget.getAttribute('data-rib');
                if (rib) {
                    showDeleteModal(rib);
                }
            });
        });

        document.querySelectorAll('.block-benif-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const rib = e.currentTarget.getAttribute('data-rib');
                const isBlocked = e.currentTarget.getAttribute('data-blocked') === 'true';
                if (rib) {
                    showBlockModal(rib, isBlocked);
                }
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", updateDisplay);
    }

    updateDisplay();

});
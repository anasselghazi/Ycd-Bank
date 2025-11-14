import { load } from "./storage.js";
import { disconnect } from "./auth.js";
import { makeTransfer } from "./transaction.js";

document.addEventListener("DOMContentLoaded", () => {

    let user = load();
    if (!user || !user.session?.isLoggedIn) {
        window.location.href = "../../auth/login.html";
        return;
    }

    document.getElementById("sidebar-user-name").textContent =
        user.user?.fullname?.toUpperCase() || "UTILISATEUR";

    document.getElementById("sidebar-user-email").textContent =
        user.user?.email || "email@exemple.com";

    document.getElementById("disconnect-link-sidebar").onclick = (e) => {
        e.preventDefault();
        disconnect();
    };

    let selectedAccount = user.card?.active === false ? "epargne" : "courant";
    const modal = document.getElementById("account-select-modal");
    const modalBtn = document.getElementById("select-account-btn");
    const modalClose = document.getElementById("close-modal-btn");
    const modalBackdrop = document.getElementById("modal-backdrop");
    const courantBtn = document.getElementById("select-courant-btn");
    const epargneBtn = document.getElementById("select-epargne-btn");

    function closeModal() {
        modal.classList.replace("flex", "hidden");
    }

    modalBtn.onclick = () => modal.classList.replace("hidden", "flex");
    modalClose.onclick = closeModal;
    modalBackdrop.onclick = closeModal;

    function updateAccountDisplay() {
        const courant = user.accounts.courant?.balance;
        const epargne = user.accounts.epargne?.balance;

        document.getElementById("modal-courant-balance").textContent = `Solde: $${courant}`;
        document.getElementById("modal-epargne-balance").textContent = `Solde: $${epargne}`;

        if (selectedAccount === "courant") {
            document.getElementById("selected-account-name").textContent = "Compte Courant";
            document.getElementById("selected-account-balance").textContent = `Solde disponible : $${courant}`;
            document.getElementById("selected-account-icon").textContent = "account_balance_wallet";
            courantBtn.classList.add("border-blue-500", "bg-blue-50", "ring-2");
            epargneBtn.classList.remove("border-blue-500", "bg-blue-50", "ring-2");
        } else {
            document.getElementById("selected-account-name").textContent = "Compte Épargne";
            document.getElementById("selected-account-balance").textContent = `Solde disponible : $${epargne}`;
            document.getElementById("selected-account-icon").textContent = "savings";
            epargneBtn.classList.add("border-blue-500", "bg-blue-50", "ring-2");
            courantBtn.classList.remove("border-blue-500", "bg-blue-50", "ring-2");
            toUpperCase()
        }
    }


    courantBtn.onclick = () => {
        if (user.card?.active === false) {
            alert("Votre carte principale est bloquée, utilisez le compte épargne.");
            selectedAccount = "epargne";
            updateAccountDisplay();
            return;
        }
        selectedAccount = "courant";
        updateAccountDisplay();
        closeModal();
    };

    epargneBtn.onclick = () => {
        selectedAccount = "epargne";
        updateAccountDisplay();
        closeModal();
    };

    updateAccountDisplay();

    const beneficiaries = user.beneficiaries || [];
    const searchInput = document.getElementById("beneficiary-search");
    const list = document.getElementById("beneficiary-list");
    const amountInput = document.getElementById("amount");
    const reasonInput = document.getElementById("reason");
    const submitBtn = document.getElementById("submit-transfer");
    if (searchInput) {
        searchInput.dataset.ribValue = "";
    }

    function showBeneficiaries(items) {
        list.innerHTML = "";

        if (items.length === 0) {
            list.innerHTML = "<p class='p-3 text-sm text-gray-500 text-center'>Aucun bénéficiaire trouvé</p>";
            return;
        }

        items.forEach(b => {
            const div = document.createElement("button");
            div.className = "w-full text-left p-3 hover:bg-gray-100 flex items-center gap-3 beneficiary-item";

            div.innerHTML = `
                <div class="h-9 w-9 bg-[#0A2A4E] text-white rounded-full grid place-items-center text-xs font-bold">
                    ${b.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div>
                    <p class="font-semibold text-sm">${b.name}</p>
                    <p class="text-xs text-gray-500">${b.rib}</p>
                </div>
            `;

            div.onclick = () => {
                searchInput.value = b.name;
                searchInput.dataset.ribValue = parseRib(b.rib || "");
                list.classList.add("hidden");
            };

            list.appendChild(div);
        });
    }

    function parseRib(text = "") {
        const clean = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (clean.length < 16) return "";
        return clean;
    }

    searchInput.onclick = () => {
        showBeneficiaries(beneficiaries);
        list.classList.remove("hidden");
    };

    searchInput.oninput = () => {
        const raw = searchInput.value;
        const filtered = beneficiaries.filter(b =>
            b.name.toLowerCase().includes(raw.toLowerCase()) ||
            b.rib.toLowerCase().includes(raw.toLowerCase())
        );
        showBeneficiaries(filtered);
        list.classList.remove("hidden");
        searchInput.dataset.ribValue = parseRib(raw);
    };

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !list.contains(e.target)) {
            list.classList.add("hidden");
        }
    });

    if (submitBtn) {
        submitBtn.onclick = () => {
            const beneficiaryName = searchInput.value.trim();
            const amountValue = parseFloat(
                (amountInput.value || "").replace(",", ".")
            );

            const ribFromInput = searchInput.dataset.ribValue || "";
            const selectedBeneficiary = beneficiaries.find(
                (b) => b.name.toLowerCase() === beneficiaryName.toLowerCase()
            );

            if (!beneficiaryName && !ribFromInput) {
                alert("Veuillez choisir un bénéficiaire ou coller un RIB valide.");
                return;
            }

            if (!amountValue || amountValue <= 0) {
                alert("Veuillez saisir un montant valide.");
                return;
            }

            const cardLimit = Number(user.card?.limit) || 0;
            if (cardLimit && amountValue > cardLimit) {
                alert(`Le montant dépasse votre plafond autorisé ($${cardLimit}).`);
                return;
            }

            const reason = reasonInput.value.trim();
            const targetRib = selectedBeneficiary?.rib || ribFromInput;
            const normalizedTargetRib = parseRib(targetRib || "");
            const epargneRib = parseRib(user.accounts?.epargne?.rib || "");
            const sendingToEpargne = normalizedTargetRib && epargneRib && normalizedTargetRib === epargneRib;

            let description;
            if (sendingToEpargne) {
                description = reason
                    ? `Transfert vers compte épargne - ${reason}`
                    : "Transfert vers compte épargne";
            } else {
                description = selectedBeneficiary
                    ? (reason ? `Virement vers ${beneficiaryName} - ${reason}` : `Virement vers ${beneficiaryName}`)
                    : (reason ? `Virement interne (RIB ${normalizedTargetRib}) - ${reason}` : `Virement interne (RIB ${normalizedTargetRib})`);
            }

            if (user.card && user.card.active === false && selectedAccount !== "epargne") {
                selectedAccount = "epargne";
                updateAccountDisplay();
                alert("Carte principale bloquée, le virement sera effectué depuis le compte épargne.");
            }

            const transfer = makeTransfer("expense", amountValue, description, {
                accountType: selectedAccount
            });

            if (sendingToEpargne && transfer) {
                const incomeDescription = reason
                    ? `Réception depuis ${selectedAccount} - ${reason}`
                    : `Réception depuis ${selectedAccount}`;
                const incomeTransfer = makeTransfer("add", amountValue, incomeDescription, {
                    accountType: "epargne"
                });

                if (!incomeTransfer) {
                    alert("Le virement vers l'épargne n'a pas pu être finalisé.");
                    return;
                }
            }

            if (!transfer) {
                alert("Le virement n'a pas pu être enregistré.");
                return;
            }

            amountInput.value = "";
            reasonInput.value = "";
            searchInput.value = "";
            list.classList.add("hidden");

            user = load();
            updateAccountDisplay();

            alert("Virement enregistré avec succès.");
        };
    }

});

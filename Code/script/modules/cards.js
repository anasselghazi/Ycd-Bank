import { load, save } from "./storage.js";

let activeCardType = "courant";

function getElements() {
  return {
    toggle: document.getElementById("card-block-toggle"),
    blockModal: document.getElementById("card-block-modal"),
    unblockModal: document.getElementById("card-unblock-modal"),
    confirmBlock: document.getElementById("confirm-block-card"),
    confirmUnblock: document.getElementById("confirm-unblock-card"),
    cancelBlock: document.getElementById("cancel-block-card"),
    cancelUnblock: document.getElementById("cancel-unblock-card"),
    rangeInput: document.getElementById("range-max"),
    rangeDisplay: document.getElementById("range-max-display"),
    saveRangeBtn: document.getElementById("save-range-max"),
    cardNumberText: document.getElementById("card-number"),
    cardHolderText: document.getElementById("card-holder"),
    cardTypeLabel: document.getElementById("card-type-label"),
    cardExpiryText: document.getElementById("card-expiry"),
    cardVisual: document.getElementById("card-visual"),
    showEpargneBtn: document.getElementById("show-epargne-card"),
    showCourantBtn: document.getElementById("show-courant-card")
  };
}

function formatCardNumber(number = "") {
  const clean = number.replace(/[^0-9]/g, "");
  if (!clean) return "---- ---- ---- ----";
  return clean.padStart(16, "0").replace(/(.{4})/g, "$1 ").trim();
}

function getCardData(user) {
  const holder = user.user?.fullname?.toUpperCase() || "UTILISATEUR";
  const principalNumber = user.card?.number || "";
  const epargneDigits = (user.accounts?.epargne?.rib || "").replace(/[^0-9]/g, "");
  const epargneNumber = epargneDigits.slice(-16) || principalNumber;

  if (activeCardType === "epargne") {
    return {
      number: formatCardNumber(epargneNumber),
      holder,
      expiry: "12/32",
      label: "Carte épargne",
      theme: "epargne"
    };
  }

  return {
    number: formatCardNumber(principalNumber),
    holder,
    expiry: "07/31",
    label: "Carte principale",
    theme: "courant"
  };
}

function syncToggleState(toggle, user) {
  if (!toggle || !user?.card) return;
  const isBlocked = !user.card.active;
  toggle.checked = isBlocked;
  toggle.setAttribute("aria-checked", String(isBlocked));
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function handleToggleChange() {
  const { blockModal, unblockModal, toggle } = getElements();
  const user = load();

  if (!user || !user.card) {
    if (toggle) toggle.checked = false;
    return;
  }

  if (toggle.checked) openModal(blockModal);
  else openModal(unblockModal);
}

function applyCardState(shouldBlock) {
  const user = load();
  const { toggle } = getElements();

  if (!user || !user.card || !toggle) return;

  user.card.active = !shouldBlock;
  save(user);
  toggle.checked = shouldBlock;
  toggle.setAttribute("aria-checked", String(shouldBlock));
}

function updateRangeDisplay(display, value, max) {
  if (!display) return;
  const current = Number(value) || 0;
  display.textContent = `$${current} / $${max}`;
}

function initLimitControls(user) {
  const { rangeInput, rangeDisplay, saveRangeBtn } = getElements();
  if (!rangeInput || !rangeDisplay || !saveRangeBtn) return;

  const sliderMax = Number(rangeInput.max) || user.card?.limit || 5000;
  const currentLimit = Number(user.card?.limit) || sliderMax;

  rangeInput.max = sliderMax;
  rangeInput.value = currentLimit;
  updateRangeDisplay(rangeDisplay, currentLimit, sliderMax);

  rangeInput.addEventListener("input", () => {
    updateRangeDisplay(rangeDisplay, rangeInput.value, sliderMax);
  });

  saveRangeBtn.addEventListener("click", () => {
    const newLimit = Number(rangeInput.value);
    if (!Number.isFinite(newLimit) || newLimit <= 0) {
      alert("Veuillez sélectionner un plafond valide.");
      return;
    }

    const latest = load();
    if (!latest || !latest.card) {
      alert("Impossible de sauvegarder le plafond.");
      return;
    }

    latest.card.limit = newLimit;
    save(latest);
    alert("Plafond enregistré.");
  });
}

function applyCardTheme(cardVisual, theme) {
  if (!cardVisual) return;
  cardVisual.classList.remove("bg-[#0A2A4E]", "bg-black");
  if (theme === "epargne") cardVisual.classList.add("bg-black");
  else cardVisual.classList.add("bg-[#0A2A4E]");
}

function refreshCardView(user) {
  const {
    cardNumberText,
    cardHolderText,
    cardTypeLabel,
    cardExpiryText,
    cardVisual,
    showEpargneBtn,
    showCourantBtn
  } = getElements();
  const data = getCardData(user);

  if (cardNumberText) cardNumberText.textContent = data.number;
  if (cardHolderText) cardHolderText.textContent = data.holder;
  if (cardTypeLabel) cardTypeLabel.textContent = data.label;
  if (cardExpiryText) cardExpiryText.textContent = data.expiry;
  applyCardTheme(cardVisual, data.theme);
  if (showEpargneBtn) {
    showEpargneBtn.classList.toggle("hidden", activeCardType === "epargne");
  }
  if (showCourantBtn) {
    showCourantBtn.classList.toggle("hidden", activeCardType === "courant");
  }
}

function setActiveCard(type) {
  activeCardType = type;
  const user = load();
  if (user) {
    refreshCardView(user);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const {
    toggle,
    blockModal,
    unblockModal,
    confirmBlock,
    confirmUnblock,
    cancelBlock,
    cancelUnblock,
    showEpargneBtn,
    showCourantBtn
  } = getElements();

  const user = load();
  if (user) {
    syncToggleState(toggle, user);
    initLimitControls(user);
    refreshCardView(user);
  }

  if (toggle) {
    toggle.addEventListener("change", handleToggleChange);
  }

  confirmBlock?.addEventListener("click", () => {
    applyCardState(true);
    closeModal(blockModal);
  });

  confirmUnblock?.addEventListener("click", () => {
    applyCardState(false);
    closeModal(unblockModal);
  });

  cancelBlock?.addEventListener("click", () => {
    applyCardState(false);
    closeModal(blockModal);
  });

  cancelUnblock?.addEventListener("click", () => {
    applyCardState(true);
    closeModal(unblockModal);
  });

  showEpargneBtn?.addEventListener("click", () => setActiveCard("epargne"));
  showCourantBtn?.addEventListener("click", () => setActiveCard("courant"));
});

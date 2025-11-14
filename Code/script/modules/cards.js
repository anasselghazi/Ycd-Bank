import { load, save } from "./storage.js";

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
    cardNumberText: document.getElementById("card-number")
  };
}

function syncToggleState(toggle, user) {
  if (!toggle || !user?.card) return;
  const isBlocked = !user.card.active;
  toggle.checked = isBlocked;
  toggle.setAttribute("aria-checked", String(isBlocked));
}

function formatCardNumber(number = "") {
  const clean = number.replace(/[^0-9]/g, "");
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function updateCardNumberDisplay(element, user) {
  if (!element || !user?.card?.number) return;
  element.textContent = formatCardNumber(user.card.number);
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

function handleToggleChange(event) {
  const { blockModal, unblockModal, toggle } = getElements();
  const user = load();

  if (!user || !user.card) {
    if (toggle) {
      toggle.checked = false;
    }
    return;
  }

  const wantsBlock = event.currentTarget.checked;
  if (wantsBlock) {
    openModal(blockModal);
  } else {
    openModal(unblockModal);
  }
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

document.addEventListener("DOMContentLoaded", () => {
  const { toggle, blockModal, unblockModal, confirmBlock, confirmUnblock, cancelBlock, cancelUnblock, cardNumberText } = getElements();
  if (!toggle) return;

  const user = load();
  if (user) {
    syncToggleState(toggle, user);
    initLimitControls(user);
    updateCardNumberDisplay(cardNumberText, user);
  }

  toggle.addEventListener("change", handleToggleChange);

  if (confirmBlock) {
    confirmBlock.addEventListener("click", () => {
      applyCardState(true);
      closeModal(blockModal);
    });
  }

  if (confirmUnblock) {
    confirmUnblock.addEventListener("click", () => {
      applyCardState(false);
      closeModal(unblockModal);
    });
  }

  if (cancelBlock) {
    cancelBlock.addEventListener("click", () => {
      applyCardState(false);
      closeModal(blockModal);
    });
  }

  if (cancelUnblock) {
    cancelUnblock.addEventListener("click", () => {
      applyCardState(true);
      closeModal(unblockModal);
    });
  }
});

import { load, save } from "./storage.js";

function getElements() {
  return {
    toggle: document.getElementById("card-block-toggle"),
    blockModal: document.getElementById("card-block-modal"),
    unblockModal: document.getElementById("card-unblock-modal"),
    confirmBlock: document.getElementById("confirm-block-card"),
    confirmUnblock: document.getElementById("confirm-unblock-card"),
    cancelBlock: document.getElementById("cancel-block-card"),
    cancelUnblock: document.getElementById("cancel-unblock-card")
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

document.addEventListener("DOMContentLoaded", () => {
  const { toggle, blockModal, unblockModal, confirmBlock, confirmUnblock, cancelBlock, cancelUnblock } = getElements();
  if (!toggle) return;

  const user = load();
  if (user) {
    syncToggleState(toggle, user);
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

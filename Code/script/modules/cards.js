import { load, save } from "./storage.js";

function syncToggleState(toggle, user) {
  if (!toggle || !user?.card) return;
  const isBlocked = !user.card.active;
  toggle.checked = isBlocked;
  toggle.setAttribute("aria-checked", String(isBlocked));
}

function handleToggleChange(event) {
  const toggle = event.currentTarget;
  const user = load();

  if (!user || !user.card) {
    toggle.checked = false;
    return;
  }

  const shouldBlock = toggle.checked;
  user.card.active = !shouldBlock;
  save(user);
  toggle.setAttribute("aria-checked", String(shouldBlock));

  const message = shouldBlock
    ? "Votre carte a été bloquée."
    : "Votre carte est désormais active.";
  alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("card-block-toggle");
  if (!toggle) return;

  const user = load();
  if (user) {
    syncToggleState(toggle, user);
  }

  toggle.addEventListener("change", handleToggleChange);
});


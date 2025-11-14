import { load } from "./storage.js";
import { disconnect } from "./auth.js";
import { get_transactions } from "./transaction.js";

const formatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  const amount = Number.isFinite(value) ? Math.abs(value) : 0;
  return formatter.format(amount);
}

function extractDateParts(value) {
  const fallback = { month: "--", day: "--" };
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return {
    month: parsed.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(parsed.getDate()).padStart(2, "0"),
  };
}

function createTransactionCard(transaction) {
  const isExpense =
    transaction.type === "expense" || (transaction.amount || 0) < 0;
  const badgeClasses = isExpense
    ? "inline-flex items-center rounded-full bg-[#F3F4F6] text-[#424B57] px-2.5 py-0.5 text-[11px] font-medium mt-1"
    : "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[11px] font-medium mt-1";

  const amountClasses = isExpense
    ? "font-bold text-[18px] whitespace-nowrap"
    : "text-emerald-600 font-bold text-[18px] whitespace-nowrap";

  const article = document.createElement("article");
  article.className =
    "flex items-center justify-between gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0]";

  const left = document.createElement("div");
  left.className = "flex items-center gap-3 flex-1";
  article.appendChild(left);

  const dateWrapper = document.createElement("div");
  dateWrapper.className = "w-14 shrink-0";
  left.appendChild(dateWrapper);

  const dateCard = document.createElement("div");
  dateCard.className =
    "rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-center py-2 leading-none";
  dateWrapper.appendChild(dateCard);

  const { month, day } = extractDateParts(transaction.date);
  const monthLabel = document.createElement("p");
  monthLabel.className =
    "text-[10px] font-bold text-[#0A2A4E] tracking-wide uppercase";
  monthLabel.textContent = month;
  dateCard.appendChild(monthLabel);

  const dayLabel = document.createElement("p");
  dayLabel.className = "text-2xl font-black";
  dayLabel.textContent = day;
  dateCard.appendChild(dayLabel);

  const details = document.createElement("div");
  details.className = "flex-1";
  left.appendChild(details);

  const description = document.createElement("p");
  description.className =
    "text-[15px] font-semibold leading-snug break-words";
  description.textContent = transaction.description || "Transaction";
  details.appendChild(description);

  const badge = document.createElement("span");
  badge.className = badgeClasses;
  badge.textContent = isExpense ? "Expense" : "Revenu";
  details.appendChild(badge);

  const amountEl = document.createElement("p");
  amountEl.className = amountClasses;
  const symbol = isExpense ? "-" : "+";
  amountEl.textContent = `${symbol}${formatCurrency(transaction.amount)} $`;
  article.appendChild(amountEl);

  return article;
}

function renderTransactions(transactions) {
  const list = document.getElementById("transactions-list");
  const emptyState = document.getElementById("transactions-empty");

  if (!list || !emptyState) {
    return;
  }

  list.innerHTML = "";

  if (!transactions || transactions.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  transactions.forEach((transaction) => {
    list.appendChild(createTransactionCard(transaction));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const user = load();

  if (!user || !user.session?.isLoggedIn) {
    window.location.href = "../../auth/login.html";
    return;
  }

  const sidebarName = document.getElementById("sidebar-user-name");
  const sidebarEmail = document.getElementById("sidebar-user-email");
  const disconnectLink = document.getElementById("disconnect-link-sidebar");

  if (sidebarName) {
    sidebarName.textContent =
      user.user?.fullname?.toUpperCase() || "UTILISATEUR";
  }

  if (sidebarEmail) {
    sidebarEmail.textContent = user.user?.email || "email@example.com";
  }

  if (disconnectLink) {
    disconnectLink.addEventListener("click", (event) => {
      event.preventDefault();
      disconnect();
    });
  }

  renderTransactions(get_transactions());
});

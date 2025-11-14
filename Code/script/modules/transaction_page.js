import { load } from "./storage.js";
import { disconnect } from "./auth.js";
import { get_transactions } from "./transaction.js";

const numberFormat = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const LIMIT = 5;
let transactions = [];
let filteredTransactions = [];
let currentPage = 1;
let currentSearch = "";

function formatMoney(value) {
  return numberFormat.format(Math.abs(Number(value) || 0));
}

function splitDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return { month: "--", day: "--" };

  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0")
  };
}

function createCard(item) {
  const isExpense = item.type === "expense" || item.amount < 0;

  const card = document.createElement("article");
  card.className = "flex items-center justify-between gap-3 p-4 bg-white rounded-xl shadow-sm border border-[#E2E8F0]";

  const leftBox = document.createElement("div");
  leftBox.className = "flex items-center gap-3 flex-1";
  card.appendChild(leftBox);

  const dateBox = document.createElement("div");
  dateBox.className = "w-14 shrink-0";
  leftBox.appendChild(dateBox);

  const dateWrap = document.createElement("div");
  dateWrap.className = "rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-center py-2 leading-none";
  dateBox.appendChild(dateWrap);

  const { month, day } = splitDate(item.date);

  const monthEl = document.createElement("p");
  monthEl.className = "text-[10px] font-bold text-[#0A2A4E] tracking-wide uppercase";
  monthEl.textContent = month;
  dateWrap.appendChild(monthEl);

  const dayEl = document.createElement("p");
  dayEl.className = "text-2xl font-black";
  dayEl.textContent = day;
  dateWrap.appendChild(dayEl);

  const infoBox = document.createElement("div");
  infoBox.className = "flex-1";
  leftBox.appendChild(infoBox);

  const title = document.createElement("p");
  title.className = "text-[15px] font-semibold leading-snug break-words";
  title.textContent = item.description || "Transaction";
  infoBox.appendChild(title);

  const tag = document.createElement("span");
  tag.className = isExpense
    ? "inline-flex items-center rounded-full bg-[#F3F4F6] text-[#424B57] px-2.5 py-0.5 text-[11px] font-medium mt-1"
    : "inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[11px] font-medium mt-1";
  tag.textContent = isExpense ? "Expense" : "Revenu";
  infoBox.appendChild(tag);

  const price = document.createElement("p");
  price.className = isExpense
    ? "font-bold text-[18px] whitespace-nowrap"
    : "text-emerald-600 font-bold text-[18px] whitespace-nowrap";
  price.textContent = `${isExpense ? "-" : "+"}${formatMoney(item.amount)} $`;
  card.appendChild(price);

  return card;
}

function showList(listItems, total) {
  const list = document.getElementById("transactions-list");
  const empty = document.getElementById("transactions-empty");

  if (total === 0) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");
  list.innerHTML = "";
  listItems.forEach(item => list.appendChild(createCard(item)));
}

function toggleBtn(btn, disabled) {
  if (!btn) return;
  btn.disabled = disabled;
  btn.classList.toggle("opacity-40", disabled);
  btn.classList.toggle("cursor-not-allowed", disabled);
  btn.classList.toggle("pointer-events-none", disabled);
}

function showPagination(totalPages) {
  const box = document.getElementById("transactions-pagination");
  const btnPrev = document.getElementById("transactions-prev");
  const btnNext = document.getElementById("transactions-next");
  const pagesBox = document.getElementById("transactions-pages");

  if (totalPages <= 1) {
    box.classList.add("hidden");
    pagesBox.innerHTML = "";
    return;
  }

  box.classList.remove("hidden");
  pagesBox.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const p = document.createElement("button");
    p.textContent = i;
    p.className =
      i === currentPage
        ? "h-9 w-9 grid place-items-center rounded-lg text-white bg-[#0A2A4E] text-sm font-bold"
        : "h-9 w-9 grid place-items-center rounded-lg text-[#0F172A] text-sm font-medium hover:bg-[#EDF2F7]";
    p.onclick = () => goToPage(i);
    pagesBox.appendChild(p);
  }

  toggleBtn(btnPrev, currentPage === 1);
  toggleBtn(btnNext, currentPage === totalPages);

  btnPrev.onclick = () => goToPage(currentPage - 1);
  btnNext.onclick = () => goToPage(currentPage + 1);
}

function goToPage(n) {
  if (!filteredTransactions || filteredTransactions.length === 0) {
    currentPage = 1;
    showList([], 0);
    showPagination(0);
    return;
  }

  const totalPages = Math.ceil(filteredTransactions.length / LIMIT);
  currentPage = Math.min(Math.max(1, n), totalPages);

  const start = (currentPage - 1) * LIMIT;
  const listItems = filteredTransactions.slice(start, start + LIMIT);

  showList(listItems, filteredTransactions.length);
  showPagination(totalPages);
}

function filterTransactions(term) {
  currentSearch = (term || "").trim().toLowerCase();

  if (!currentSearch) {
    filteredTransactions = [...transactions];
    goToPage(1);
    return;
  }

  filteredTransactions = transactions.filter((item) => {
    const description = (item.description || "").toLowerCase();
    const type = (item.type || "").toLowerCase();
    const account = (item.account || "").toLowerCase();
    const amountText = formatMoney(item.amount).toLowerCase();
    const dateText = item.date ? String(item.date).toLowerCase() : "";

    return (
      description.includes(currentSearch) ||
      type.includes(currentSearch) ||
      account.includes(currentSearch) ||
      amountText.includes(currentSearch) ||
      dateText.includes(currentSearch)
    );
  });

  goToPage(1);
}

document.addEventListener("DOMContentLoaded", () => {
  const user = load();

  if (!user || !user.session || !user.session.isLoggedIn) {
    window.location.href = "../../auth/login.html";
    return;
  }

  const nameBox = document.getElementById("sidebar-user-name");
  const mailBox = document.getElementById("sidebar-user-email");
  const logoutBtn = document.getElementById("disconnect-link-sidebar");

  if (nameBox) nameBox.textContent = user.user.fullname?.toUpperCase() || "UTILISATEUR";
  if (mailBox) mailBox.textContent = user.user.email || "email@example.com";
  if (logoutBtn) logoutBtn.onclick = e => { e.preventDefault(); disconnect(); };

  transactions = get_transactions();
  filteredTransactions = [...transactions];

  const searchInput = document.getElementById("transactions-search");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      filterTransactions(event.target.value);
    });
  }

  goToPage(1);
});

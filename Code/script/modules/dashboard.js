import { load } from './storage.js';
import { disconnect } from './auth.js';
import { toggleBalance, initBalanceView } from './ballance_show.js';
import { get_transactions } from './transaction.js';

function handleCopyRib(ribToCopy, textElement) {
  if (!ribToCopy) {
    console.log("Problem: No RIB to copy");
    return;
  }

  navigator.clipboard.writeText(ribToCopy).then(function() {
    textElement.textContent = "Copié !";
    console.log("RIB copied");

    setTimeout(function() {
      textElement.textContent = "Copier";
    }, 2000);

  }).catch(function() {
    console.log("Problem: Failed to copy RIB");
  });
}

function displayRecentTransactions(transactions, container) {
  container.innerHTML = '';

  if (!transactions || transactions.length === 0) {
    console.log("No transactions to show");
    container.innerHTML = '<p class="text-sm text-gray-500 text-center">Aucune transaction récente.</p>';
    return;
  }

  console.log("Showing 2 recent transactions");
  const recentTransactions = transactions.slice(0, 2);

  recentTransactions.forEach(function(tx) {
    const txDate = new Date(tx.date);
    const formattedDate = `${txDate.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'})} · ${txDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`;
    
    const isExpense = tx.amount < 0;
    const amountColor = isExpense ? 'text-[#F43F5E]' : 'text-[#059669]';
    const iconBg = isExpense ? 'bg-[#FDE7E7]' : 'bg-[#D1FAE5]';
    const iconSrc = isExpense ? '../../media/dashboard/send.svg' : '../../media/dashboard/send-green.svg';
    const amountDisplay = isExpense ? `-$${Math.abs(tx.amount)}` : `+$${tx.amount}`;
    const description = tx.description || "Transaction";

    const transactionHtml = `
    <div class="bg-white border border-[#E2E8F0] rounded-[18px] px-4 py-3 sm:px-5 sm:py-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="h-[44px] w-[44px] sm:h-[50px] sm:w-[50px] rounded-full ${iconBg} grid place-items-center">
            <img src="${iconSrc}" class="h-[18px]" alt="">
          </div>
          <div>
            <p class="text-[14px] sm:text-[16px] font-semibold leading-tight">${description}</p>
            <p class="text-[11px] text-[#64748B] mt-0.5">${formattedDate}</p>
          </div>
        </div>
        <p class="font-extrabold text-[14px] sm:text-[18px] ${amountColor}">${amountDisplay}</p>
      </div>
    </div>`;
    
    container.innerHTML += transactionHtml;
  });
}

document.addEventListener("DOMContentLoaded", function() {

  const sidebarUserName = document.getElementById("sidebar-user-name");
  const sidebarUserEmail = document.getElementById("sidebar-user-email");
  const disconnectLinkSidebar = document.getElementById("disconnect-link-sidebar");
  const greetingHeader = document.getElementById("greeting-header");
  const balanceToggleBtn = document.getElementById("balance-toggle-btn");
  const balanceDisplay = document.getElementById("balance-display");
  const ribDisplay = document.getElementById("rib-display");
  const copyRibBtn = document.getElementById("copy-rib-btn");
  const copyRibText = document.getElementById("copy-rib-text");
  const transactionListContainer = document.getElementById("transaction-list-container");

  const user = load();

  if (user && user.session.isLoggedIn) {
    console.log("User logged in");
    
    if (user.user) {
      const upperCaseName = user.user.fullname ? user.user.fullname.toUpperCase() : "UTILISATEUR";
      sidebarUserName.textContent = upperCaseName;
      greetingHeader.textContent = `BONJOUR, ${upperCaseName}`;
      sidebarUserEmail.textContent = user.user.email || "email.non.fourni@exemple.com";
    }

    if (user.accounts && user.accounts.courant) {
      ribDisplay.textContent = user.accounts.courant.rib || "RIB non disponible";
    }

    initBalanceView(balanceDisplay, balanceToggleBtn);
    balanceToggleBtn.addEventListener("click", function() {
      toggleBalance(balanceDisplay, balanceToggleBtn);
    });

    disconnectLinkSidebar.addEventListener("click", function(e) {
      e.preventDefault();
      disconnect();
    });

    copyRibBtn.addEventListener("click", function() {
      const rib = user.accounts?.courant?.rib;
      handleCopyRib(rib, copyRibText);
    });

    const transactions = get_transactions();
    displayRecentTransactions(transactions, transactionListContainer);

  } else {
    console.log("User not logged in or session expired.");
    
    sidebarUserName.textContent = "Visiteur";
    sidebarUserEmail.textContent = "Veuillez vous connecter";
    greetingHeader.textContent = "BONJOUR";
    ribDisplay.textContent = "---";
    
    initBalanceView(balanceDisplay, balanceToggleBtn); 
    
    balanceToggleBtn.disabled = true;
    copyRibBtn.disabled = true;
    disconnectLinkSidebar.href = "../../index.html"; 
  }
});
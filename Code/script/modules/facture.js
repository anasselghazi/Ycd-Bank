 import { makeTransfer } from "./transaction.js";
// les variables

const lydec = document.getElementById("lydec");
const autor = document.getElementById("autor");

const refClient = document.getElementById("refClient");
const ajouterFav = document.getElementById("ajouterfav");
const effacer = document.getElementById("effacer");

const montantInput = document.getElementById("montant");
const m50 = document.getElementById("m50");
const m100 = document.getElementById("m100");
const m200 = document.getElementById("m200");
const m500 = document.getElementById("m500");

const annuler = document.getElementById("annuler");
const payer = document.getElementById("payer");


//666666666
// sélectionner un fournisseur
function selectFournisseur(selected, other) {
  selected.classList.add("ring-2", "ring-blue-500");
  other.classList.remove("ring-2", "ring-blue-500");
}

// le  montant 
function setMontant(value) {
  montantInput.value = value;
}

// réinitialiser tous les inputs
function resetForm() {
  refClient.value = "";
  montantInput.value = "";
  lydec.classList.remove("ring-2", "ring-blue-500");
  autor.classList.remove("ring-2", "ring-blue-500");
}

// obtenit le fournisseur sélectionné
function getFournisseur() {
  if (lydec.classList.contains("ring-2")) return "LYDEC";
  if (autor.classList.contains("ring-2")) return "AUTOR";
  return null;
}


// choisirr un fournisseur
lydec.addEventListener("click", () => selectFournisseur(lydec, autor));
autor.addEventListener("click", () => selectFournisseur(autor, lydec));

// effacer la référence 
effacer.addEventListener("click", () => {
  refClient.value = "";
});

// selectioner un montant 
m50.addEventListener("click", () => setMontant(50));
m100.addEventListener("click", () => setMontant(100));
m200.addEventListener("click", () => setMontant(200));
m500.addEventListener("click", () => setMontant(500));

// annuler 
annuler.addEventListener("click", resetForm);

 
//  AJOUT DE makeTransfer DANS "payer"
payer.addEventListener("click", () => {
  const fournisseur = getFournisseur();
  const montant = Number(montantInput.value);

  if (!fournisseur || !refClient.value || !montant) {
    alert("Veuillez remplir tous les champs avant de payer !");
    return;
  }

  // --- Utilisation de makeTransfer ici ---
  const t = makeTransfer(
    "expense",                     
    montant,                     
    `Facture ${fournisseur}`,      
    { accountType: "courant" }     
  );

  if (!t) {
    alert("Paiement échoué ! Vérifiez votre solde.");
    return;
  }

  alert(`Paiement de ${montant}$ à ${fournisseur} effectué !`);
  resetForm();
});


// Ajouter aux favoris
ajouterFav.addEventListener("click", () => {
  if (refClient.value) {
    alert(`Référence ${refClient.value} ajoutée aux favoris !`);
  } else {
    alert("Veuillez saisir une référence client avant d'ajouter aux favoris.");
  }
});

 // Sélection des éléments
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

// Fonction pour sélectionner un fournisseur
function selectFournisseur(selected, other) {
  selected.classList.add("ring-2", "ring-blue-500");
  other.classList.remove("ring-2", "ring-blue-500");
}

// Événements fournisseur
lydec.addEventListener("click", () => selectFournisseur(lydec, autor));
autor.addEventListener("click", () => selectFournisseur(autor, lydec));

// Effacer la référence client
effacer.addEventListener("click", () => {
  refClient.value = "";
});

// Ajouter montant rapide
function setMontant(value) {
  montantInput.value = value;
}

m50.addEventListener("click", () => setMontant(50));
m100.addEventListener("click", () => setMontant(100));
m200.addEventListener("click", () => setMontant(200));
m500.addEventListener("click", () => setMontant(500));

 
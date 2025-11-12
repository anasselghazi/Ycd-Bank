 // -------------------
// SÉLECTION DES ÉLÉMENTS
// -------------------
const btnInwi = document.getElementById("btninwi");
const btnMtel = document.getElementById("btnmtel");
const btnOrnge = document.getElementById("btnornge");

const phoneInput = document.getElementById("phone");
const ajoutFav = document.getElementById("ajoutfav");
const effacer = document.getElementById("effacer");

const m10 = document.getElementById("m10");
const m20 = document.getElementById("m20");
const m50 = document.getElementById("m50");
const m100 = document.getElementById("m100");
const montantPerso = document.getElementById("montant");

const sljour = document.getElementById("sljour");
const slsemain = document.getElementById("slsemain");
const sltiktok = document.getElementById("sltiktok");
const youtub = document.getElementById("youtub");
const internet = document.getElementById("internet");
const appele = document.getElementById("appele");

const annuler = document.getElementById("annluer");
const recharger = document.getElementById("recharger");

// -------------------
// VARIABLES
// -------------------
let selectedOperator = "";
let selectedMontant = "";
let selectedOffre = "";
let favoris = [];

// -------------------
// FONCTIONS
// -------------------

// Vérifier numéro marocain
function isValidPhone(num) {
    const pattern = /^(05|06|07|08)\d{8}$/;
    return pattern.test(num);
}

// Animation simple pour les opérateurs
function selectOperator(btn, name) {
    // reset couleur des autres boutons
    [btnInwi, btnMtel, btnOrnge].forEach(b => b.style.backgroundColor = "");
    // couleur du bouton sélectionné
    btn.style.backgroundColor = "#87CEFA"; // bleu clair
    selectedOperator = name;
}

// -------------------
// ÉVÉNEMENTS
// -------------------

// Opérateurs
btnInwi.onclick = () => selectOperator(btnInwi, "Inwi");
btnMtel.onclick = () => selectOperator(btnMtel, "Maroc Telecom");
btnOrnge.onclick = () => selectOperator(btnOrnge, "Orange");

// Ajouter aux favoris
ajoutFav.onclick = () => {
    const num = phoneInput.value.trim();
    if (num === "") { alert("Entrez un numéro !"); return; }
    if (!isValidPhone(num)) { alert("Numéro invalide !"); return; }
    if (!favoris.includes(num)) {
        favoris.push(num);
        alert("Numéro ajouté aux favoris !");
    } else {
        alert("Numéro déjà en favoris !");
    }
    phoneInput.value = "";
};

// Effacer numéro
effacer.onclick = () => phoneInput.value = "";

// Montants rapides
m10.onclick = () => selectedMontant = "$10";
m20.onclick = () => selectedMontant = "$20";
m50.onclick = () => selectedMontant = "$50";
m100.onclick = () => selectedMontant = "$100";

// Montant personnalisé
montantPerso.oninput = () => selectedMontant = "$" + montantPerso.value;

// Offres
sljour.onclick = () => selectedOffre = "Social illimité (24h)";
slsemain.onclick = () => selectedOffre = "Social illimité (7j)";
sltiktok.onclick = () => selectedOffre = "TikTok 5GB";
youtub.onclick = () => selectedOffre = "YouTube 5GB";
internet.onclick = () => selectedOffre = "Internet 10GB";
appele.onclick = () => selectedOffre = "Appels 60 min";

// Annuler
annuler.onclick = () => {
    selectedOperator = "";
    selectedMontant = "";
    selectedOffre = "";
    phoneInput.value = "";
    montantPerso.value = "";
    favoris = [];
    [btnInwi, btnMtel, btnOrnge].forEach(b => b.style.backgroundColor = "");
    alert("Tout a été réinitialisé !");
};

// Recharger
recharger.onclick = () => {
    if (selectedOperator === "") { alert("Sélectionnez un opérateur !"); return; }
    if (phoneInput.value === "" && favoris.length === 0) { alert("Entrez un numéro !"); return; }
    if (phoneInput.value !== "" && !isValidPhone(phoneInput.value)) { alert("Numéro invalide !"); return; }
    if (selectedMontant === "") { alert("Sélectionnez un montant !"); return; }
    if (selectedOffre === "") { alert("Sélectionnez une offre !"); return; }

    const num = phoneInput.value || favoris[favoris.length - 1];

    alert(`Recharge en cours :
Opérateur: ${selectedOperator}
Numéro: ${num}
Montant: ${selectedMontant}
Offre: ${selectedOffre}`);
};

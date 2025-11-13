  
//  SÉLECTION DES ÉLÉMENTS

const btnInwi = document.getElementById("btninwi");
const btnMtel = document.getElementById("btnmtel");
const btnOrnge = document.getElementById("btnornge");

const phoneInput = document.getElementById("phone");
const ajouterFav = document.getElementById("ajoutfav");
const effacerBtn = document.getElementById("effacer");

const offers = document.querySelectorAll(
  "#sljour, #slsemain, #sltiktok, #youtub, #internet, #appele"
);
const annulerBtn = document.getElementById("annluer");
const rechargerBtn = document.getElementById("recharger");

// Variables globales
let operateur = "";
let offreChoisie = "";
let favoris = [];

//  L OPÉRATEUR (ANIMATION)

function resetOperateurs() {
  [btnInwi, btnMtel, btnOrnge].forEach((btn) => {
    btn.classList.remove("ring-2", "ring-indigo-500", "shadow-md");
  });
}

btnInwi.addEventListener("click", () => {
  resetOperateurs();
  btnInwi.classList.add("ring-2", "ring-indigo-500", "shadow-md");
  operateur = "inwi";
});

btnMtel.addEventListener("click", () => {
  resetOperateurs();
  btnMtel.classList.add("ring-2", "ring-indigo-500", "shadow-md");
  operateur = "maroc telecom";
});

btnOrnge.addEventListener("click", () => {
  resetOperateurs();
  btnOrnge.classList.add("ring-2", "ring-indigo-500", "shadow-md");
  operateur = "orange";
});

// NUMÉRO AUX FAVORIS

ajouterFav.addEventListener("click", () => {
  const numero = phoneInput.value.trim();

  if (!numero.match(/^(05|06|07|08)\d{8}$/)) {
    alert("❌ Numéro invalide !");
    return;
  }

  if (favoris.includes(numero)) {
    alert("⚠️ Ce numéro est déjà dans vos favoris !");
    return;
  }

  favoris.push(numero);
  alert(`⭐ Numéro ${numero} ajouté aux favoris !`);
  console.log("Favoris actuels:", favoris);
});



 
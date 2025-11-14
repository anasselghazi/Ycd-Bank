  
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
    alert(" Numéro invalide !");
    return;
  }

  if (favoris.includes(numero)) {
    alert(" Ce numéro est déjà dans vos favoris !");
    return;
  }

  favoris.push(numero);
  alert(` Numéro ${numero} ajouté aux favoris !`);
  console.log("Favoris actuels:", favoris);
});

//  EFFACER LE FORMULAIRE

effacerBtn.addEventListener("click", () => {
  phoneInput.value = "";
});



// SÉLECTION DE L OFFRE

offers.forEach((offre) => {
  offre.addEventListener("click", () => {
    offers.forEach((o) => o.classList.remove("ring-2", "ring-indigo-500"));
    offre.classList.add("ring-2", "ring-indigo-500");
    offreChoisie = offre.querySelector(".font-semibold").textContent;
  });
});



// ANNULER ET  RECHARGER

annulerBtn.addEventListener("click", () => {
  phoneInput.value = "";
  offreChoisie = "";
  resetOperateurs();
  offers.forEach((o) => o.classList.remove("ring-2", "ring-indigo-500"));
});

rechargerBtn.addEventListener("click", () => {
  const numero = phoneInput.value.trim();

  if (!operateur) {
    alert(" Sélectionnez un opérateur !");
    return;
  }

  if (!numero.match(/^(05|06|07|08)\d{8}$/)) {
    alert(" Numéro invalide !");
    return;
  }

  if (!offreChoisie) {
    alert(" Choisissez une offre !");
    return;
  }

  alert(
    ` Recharge réussie !\n\nOpérateur: ${operateur}\nNuméro: ${numero}\nOffre: ${offreChoisie}`
  );

  // Reset après recharge
  annulerBtn.click();
});


 

 

 
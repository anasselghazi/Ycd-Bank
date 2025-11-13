  
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



 
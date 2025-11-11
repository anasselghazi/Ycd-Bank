
// Étape 1 : Fournisseurs
const lydec = document.getElementById('lydec');
const autor = document.getElementById('autor');
let fournisseurChoisi = null;

lydec.addEventListener('click', () => {
  fournisseurChoisi = "Lydec";
  lydec.classList.add('ring-2', 'ring-blue-500');
  autor.classList.remove('ring-2', 'ring-blue-500');
});

autor.addEventListener('click', () => {
  fournisseurChoisi = "Autor";
  autor.classList.add('ring-2', 'ring-blue-500');
  lydec.classList.remove('ring-2', 'ring-blue-500');
});

// Étape 2 : Référence client
const refClient = document.getElementById('refClient');
const effacer = document.getElementById('effacer');

effacer.addEventListener('click', () => {
  refClient.value = "";
});

// Étape 3 : Montant
const montant = document.getElementById('montant');
document.getElementById('m50').addEventListener('click', () => montant.value = 50);
document.getElementById('m100').addEventListener('click', () => montant.value = 100);
document.getElementById('m200').addEventListener('click', () => montant.value = 200);
document.getElementById('m500').addEventListener('click', () => montant.value = 500);

// Étape 4 : Boutons d'action
const payer = document.getElementById('payer');
const annuler = document.getElementById('annuler');

annuler.addEventListener('click', () => {
  refClient.value = "";
  montant.value = "";
  fournisseurChoisi = null;
  lydec.classList.remove('ring-2', 'ring-blue-500');
  autor.classList.remove('ring-2', 'ring-blue-500');
});

payer.addEventListener('click', () => {
  if (!fournisseurChoisi || !refClient.value || !montant.value) {
    alert("⚠️ Veuillez remplir tous les champs avant de payer.");
    return;
  }

  alert(`✅ Paiement effectué : 
  Fournisseur : ${fournisseurChoisi}
  Référence : ${refClient.value}
  Montant : ${montant.value} $`);
});

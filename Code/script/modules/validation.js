const nameRegex = /^[a-zA-Z\s]{2,50}$/;
const cinRegex = /^[A-Z]{1,2}\d{6,8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(05|06|07)\d{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;

let selectedCivilite = '';
let selectedCard = null;
let tempUserData = {};


function isFieldRequired(value) { return typeof value === 'string' && value.trim().length > 0; }
function isValid(value, pattern) { return pattern.test(value); }

function displayError(inputElement, errorMessage, shouldDisplay) {
    const errorElement = document.getElementById(inputElement.id + 'Error');
    if (shouldDisplay) {
      inputElement.classList.add('input-error');
      errorElement.textContent = errorMessage;
      errorElement.classList.remove('hidden');
    } else {
      inputElement.classList.remove('input-error');
      errorElement.classList.add('hidden');
      errorElement.textContent = '';
    }
}
function navigateTo(pageId) {
    document.getElementById('signupPage').classList.add('hidden');
    document.getElementById('cardPage').classList.add('hidden');
    document.getElementById('passwordPage').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}


function validateSingleSignupField(input) {
  let isValidField = true;
  const value = input.value;
  const name = input.name;

  if (!isFieldRequired(value)) {
    displayError(input, `Le champ ${input.placeholder || name} est obligatoire.`, true);
    return false;
  }
 
  switch (name) {
    case 'name':
      if (!isValid(value, nameRegex)) {
        displayError(input, 'Format de nom invalide.', true);
        isValidField = false;
      }
      break;
    case 'cin':
      if (!isValid(value.toUpperCase(), cinRegex)) {
        displayError(input, 'Format CIN invalide (ex: AA123456).', true);
        isValidField = false;
      }
      break;
    case 'email':
      if (!isValid(value, emailRegex)) {
        displayError(input, 'Format d\'email invalide.', true);
        isValidField = false;
      }
      break;
    case 'phone':
      const cleanPhone = value.replace(/[^0-9]/g, '');
      if (!isValid(cleanPhone, phoneRegex)) {
        displayError(input, 'Format de téléphone invalide.', true);
        isValidField = false;
      }
      break;
  }

  if (isValidField) {
    displayError(input, '', false);
  }
 
  return isValidField;
}

function validateCivilite() {
  const civiliteInputs = document.getElementById('signupForm').querySelectorAll('input[name="civilite"]');
  let civiliteSelected = false;
 
  for (const input of civiliteInputs) {
      if (input.checked) {
          civiliteSelected = true;
          selectedCivilite = input.value;
          break;
      }
  }

  const civiliteError = document.getElementById('civiliteError');
  if (!civiliteSelected) {
      civiliteError.textContent = 'Veuillez sélectionner votre civilité.';
      civiliteError.classList.remove('hidden');
  } else {
      civiliteError.classList.add('hidden');
  }
  return civiliteSelected;
}


function validatePassword(input) {
    const value = input.value;
    let isValidField = true;

    if (!isFieldRequired(value)) {
        displayError(input, 'Le mot de passe est obligatoire.', true);
        isValidField = false;
    } else if (!isValid(value, passwordRegex)) {
        displayError(input, 'Doit contenir 8+ caractères, Majuscule, minuscule, chiffre et caractère spécial.', true);
        isValidField = false;
    } else {
        displayError(input, '', false);
    }
   
    return isValidField;
}

function validatePasswordMatch() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
   
    if (!isFieldRequired(confirmPassword)) {
        displayError(confirmPasswordInput, 'Veuillez confirmer le mot de passe.', true);
        return false;
    } else if (password !== confirmPassword) {
        displayError(confirmPasswordInput, 'Les mots de passe ne correspondent pas.', true);
        return false;
    } else {
        displayError(confirmPasswordInput, '', false);
        return true;
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const blueCard = document.getElementById('blueCard');
    const pinkCard = document.getElementById('pinkCard');
    const cardError = document.getElementById('cardError');

    document.querySelectorAll('#signupForm input[type="text"], #signupForm input[type="email"], #signupForm input[type="tel"]').forEach(input => {
      input.addEventListener('input', function() {
        validateSingleSignupField(this);
      });
    });

    document.querySelectorAll('input[name="civilite"]').forEach(input => {
        input.addEventListener('change', validateCivilite);
    });

    
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
     
      let formIsValid = true;
      const fields = ['name', 'cin', 'email', 'phone'];

      fields.forEach(fieldName => {
          const input = document.getElementById(fieldName);
          if (!validateSingleSignupField(input)) {
              formIsValid = false;
          }
      });

      if (!validateCivilite()) {
          formIsValid = false;
      }
     
      if (formIsValid) {
        tempUserData = {
            name: document.getElementById('name').value,
            cin: document.getElementById('cin').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };

        document.getElementById('blueCardTitle').textContent = `${selectedCivilite} ${tempUserData.name}`;
        navigateTo('cardPage');
      }
    });

    function selectCard(cardElement) {
        blueCard.classList.remove('card-selected');
        pinkCard.classList.remove('card-selected');
        cardElement.classList.add('card-selected');
        selectedCard = cardElement.getAttribute('data-card-type');
        cardError.classList.add('hidden');
    }

    blueCard.addEventListener('click', () => selectCard(blueCard));
    pinkCard.addEventListener('click', () => selectCard(pinkCard));

    document.getElementById('continueToPassword').addEventListener('click', function() {
      if (!selectedCard) {
        cardError.classList.remove('hidden');
      } else {
        navigateTo('passwordPage');
      }
    });



    passwordInput.addEventListener('input', function() {
        validatePassword(passwordInput);
        if (isFieldRequired(confirmPasswordInput.value)) {
            validatePasswordMatch();
        }
    });

    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    
    passwordForm.addEventListener('submit', function(e) {
      e.preventDefault();
     
      const isPasswordValid = validatePassword(passwordInput);
      const isMatchValid = validatePasswordMatch();


    });
    document.getElementById('backToSignupFromCard').addEventListener('click', () => navigateTo('signupPage'));
    document.getElementById('backToCard').addEventListener('click', () => navigateTo('cardPage'));
});

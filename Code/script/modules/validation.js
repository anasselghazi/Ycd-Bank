const nameRegex = /^[a-zA-Z\s]{2,50}$/;
const cinRegex = /^[A-Z]{1,2}\d{6,8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(05|06|07)\d{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
const ribRegex = /^[A-Z0-9]{10,34}$/;

let selectedCivilite = '';
let selectedCard = null;
let tempUserData = {};

function isFieldRequired(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValid(value, pattern) {
  return pattern.test(value);
}

function cleanRib(value = '') {
  return value.replace(/[\s-]/g, '').toUpperCase();
}

function displayError(inputElement, errorMessage, shouldDisplay) {
  const errorElement = document.getElementById(inputElement.id + 'Error');
  if (!errorElement) return;

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
  const sections = ['signupPage', 'cardPage', 'passwordPage'];
  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.classList.add('hidden');
    }
  });

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
  }
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
        displayError(input, "Format d'email invalide.", true);
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
  const signupForm = document.getElementById('signupForm');
  if (!signupForm) return false;

  const civiliteInputs = signupForm.querySelectorAll('input[name="civilite"]');
  let civiliteSelected = false;

  for (const input of civiliteInputs) {
    if (input.checked) {
      civiliteSelected = true;
      selectedCivilite = input.value;
      break;
    }
  }

  const civiliteError = document.getElementById('civiliteError');
  if (civiliteError) {
    if (!civiliteSelected) {
      civiliteError.textContent = 'Veuillez sélectionner votre civilité.';
      civiliteError.classList.remove('hidden');
    } else {
      civiliteError.classList.add('hidden');
    }
  }

  return civiliteSelected;
}

function validatePassword(input) {
  if (!input) return false;
  const value = input.value;
  let isValidField = true;

  if (!isFieldRequired(value)) {
    displayError(input, 'Le mot de passe est obligatoire.', true);
    isValidField = false;
  } else if (!isValid(value, passwordRegex)) {
    displayError(input, 'Doit contenir 8+ caractères, majuscule, minuscule, chiffre et caractère spécial.', true);
    isValidField = false;
  } else {
    displayError(input, '', false);
  }

  return isValidField;
}

function validatePasswordMatch() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  if (!passwordInput || !confirmPasswordInput) return false;

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

export function validateBeneficiaryInputs(nameInput, ribInput) {
  if (!nameInput || !ribInput) return false;

  let isValidField = true;
  const nameValue = nameInput.value.trim();
  const ribValue = cleanRib(ribInput.value);

  if (!isFieldRequired(nameValue) || !isValid(nameValue, nameRegex)) {
    displayError(nameInput, 'Nom invalide (lettres uniquement).', true);
    isValidField = false;
  } else {
    displayError(nameInput, '', false);
  }

  if (!isFieldRequired(ribValue)) {
    displayError(ribInput, 'Le RIB est obligatoire.', true);
    isValidField = false;
  } else if (!isValid(ribValue, ribRegex)) {
    displayError(ribInput, 'RIB invalide (10 à 34 caractères).', true);
    isValidField = false;
  } else {
    displayError(ribInput, '', false);
  }

  return isValidField;
}

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signupForm');
  const passwordForm = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const blueCard = document.getElementById('blueCard');
  const pinkCard = document.getElementById('pinkCard');
  const cardError = document.getElementById('cardError');
  const continueToPasswordBtn = document.getElementById('continueToPassword');
  const backToSignupBtn = document.getElementById('backToSignupFromCard');
  const backToCardBtn = document.getElementById('backToCard');

  if (!signupForm && !passwordForm) {
    return;
  }

  if (signupForm) {
    document
      .querySelectorAll('#signupForm input[type="text"], #signupForm input[type="email"], #signupForm input[type="tel"]')
      .forEach((input) => {
        input.addEventListener('input', function () {
          validateSingleSignupField(this);
        });
      });

    document.querySelectorAll('input[name="civilite"]').forEach((input) => {
      input.addEventListener('change', validateCivilite);
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let formIsValid = true;
      const fields = ['name', 'cin', 'email', 'phone'];

      fields.forEach((fieldName) => {
        const input = document.getElementById(fieldName);
        if (input && !validateSingleSignupField(input)) {
          formIsValid = false;
        }
      });

      if (!validateCivilite()) {
        formIsValid = false;
      }

      if (formIsValid) {
        tempUserData = {
          name: document.getElementById('name')?.value || '',
          cin: document.getElementById('cin')?.value || '',
          email: document.getElementById('email')?.value || '',
          phone: document.getElementById('phone')?.value || ''
        };

        const cardTitle = document.getElementById('blueCardTitle');
        if (cardTitle) {
          cardTitle.textContent = `${selectedCivilite} ${tempUserData.name}`;
        }

        navigateTo('cardPage');
      }
    });
  }

  function selectCard(cardElement) {
    if (!cardElement) return;
    if (blueCard) blueCard.classList.remove('card-selected');
    if (pinkCard) pinkCard.classList.remove('card-selected');
    cardElement.classList.add('card-selected');
    selectedCard = cardElement.getAttribute('data-card-type');
    if (cardError) cardError.classList.add('hidden');
  }

  if (blueCard) {
    blueCard.addEventListener('click', () => selectCard(blueCard));
  }
  if (pinkCard) {
    pinkCard.addEventListener('click', () => selectCard(pinkCard));
  }

  if (continueToPasswordBtn) {
    continueToPasswordBtn.addEventListener('click', function () {
      if (!selectedCard) {
        if (cardError) {
          cardError.classList.remove('hidden');
        }
      } else {
        navigateTo('passwordPage');
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      validatePassword(passwordInput);
      if (confirmPasswordInput && isFieldRequired(confirmPasswordInput.value)) {
        validatePasswordMatch();
      }
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  }

  if (passwordForm && passwordInput && confirmPasswordInput) {
    passwordForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const isPasswordValid = validatePassword(passwordInput);
      const isMatchValid = validatePasswordMatch();

      if (isPasswordValid && isMatchValid) {
        navigateTo('signupPage');
      }
    });
  }

  if (backToSignupBtn) {
    backToSignupBtn.addEventListener('click', () => navigateTo('signupPage'));
  }
  if (backToCardBtn) {
    backToCardBtn.addEventListener('click', () => navigateTo('cardPage'));
  }
});


const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
const cinRegex = /^[A-Z]{1,2}\d{6,8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(05|06|07)\d{8}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
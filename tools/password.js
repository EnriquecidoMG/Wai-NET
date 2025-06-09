console.log('password.js cargado');

// Espera hasta que el nuevo contenido esté en el DOM
setTimeout(() => {
  const button = document.getElementById('generate');
  if (button) {
    button.addEventListener('click', generatePassword);
    console.log('Botón conectado');
  } else {
    console.warn('No se encontró el botón #generate');
  }
}, 0);

function getRandomChar(charSet) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

function shuffleString(str) {
  return [...str].sort(() => 0.5 - Math.random()).join('');
}

function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  const includeUppercase = document.getElementById('uppercase').checked;
  const includeLowercase = document.getElementById('lowercase').checked;
  const includeNumbers = document.getElementById('numbers').checked;
  const includeSymbols = document.getElementById('symbols').checked;

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+{}[]|:;,.<>?';

  let allChars = '';
  let guaranteed = '';

  if (includeUppercase) {
    allChars += upper;
    guaranteed += getRandomChar(upper);
  }
  if (includeLowercase) {
    allChars += lower;
    guaranteed += getRandomChar(lower);
  }
  if (includeNumbers) {
    allChars += numbers;
    guaranteed += getRandomChar(numbers);
  }
  if (includeSymbols) {
    allChars += symbols;
    guaranteed += getRandomChar(symbols);
  }

  if (!allChars) {
    document.getElementById('output').textContent = 'Selecciona al menos una opción.';
    return;
  }

  let password = guaranteed;
  for (let i = guaranteed.length; i < length; i++) {
    password += getRandomChar(allChars);
  }

  document.getElementById('output').textContent = shuffleString(password);
}


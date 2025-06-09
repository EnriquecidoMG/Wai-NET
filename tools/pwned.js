console.log('✅ pwned.js cargado');

function setupPwnedChecker() {
  const checkBtn = document.getElementById('check-password-btn');
  const passwordInput = document.getElementById('password-input');
  const resultDiv = document.getElementById('pwned-result');

  if (!checkBtn || !passwordInput || !resultDiv) {
    console.error('❌ Elementos no encontrados en el DOM.');
    return;
  }

  checkBtn.addEventListener('click', async () => {
    const password = passwordInput.value.trim();
    console.log('🔍 Botón clicado');
    console.log('Contraseña ingresada:', password);
    console.log('electronAPI:', window.electronAPI);

    if (!password) {
      resultDiv.style.color = 'red';
      resultDiv.style.display = 'block';
      resultDiv.textContent = 'Por favor, introduce una contraseña.';
      return;
    }

    resultDiv.style.color = 'black';
    resultDiv.style.display = 'block';
    resultDiv.textContent = 'Verificando...';

    try {
      const { found } = await window.electronAPI.checkPassword(password);

      if (found) {
        resultDiv.style.color = 'red';
        resultDiv.innerHTML = '⚠️ <strong>Contraseña comprometida</strong><br>Esta contraseña aparece en filtraciones.';
      } else {
        resultDiv.style.color = 'green';
        resultDiv.innerHTML = '✅ Contraseña segura<br>No aparece en filtraciones conocidas.';
      }
    } catch (error) {
      resultDiv.style.color = 'red';
      resultDiv.textContent = 'Error al verificar la contraseña';
      console.error(error);
    }
  });
}

// Ejecutar inmediatamente después de cargar el script
setupPwnedChecker();

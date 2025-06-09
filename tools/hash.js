console.log('hash-generator.js cargado');

setTimeout(() => {
  const button = document.getElementById('generate');
  if (button) {
    button.addEventListener('click', generateHash);
    console.log('Botón conectado');
  } else {
    console.warn('No se encontró el botón #generate');
  }
}, 0);

async function generateHash() {
  const input = document.getElementById('input-text').value;
  const algo = document.getElementById('algo').value;
  const output = document.getElementById('output');

  if (!input) {
    output.textContent = 'Por favor ingresa un texto para hashear.';
    return;
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest(algo, data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    output.textContent = `${algo} hash:\n${hashHex}`;
  } catch (error) {
    output.textContent = 'Error al generar el hash: ' + error.message;
  }
}

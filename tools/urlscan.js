console.log('✅ urlscan.js cargado');

function setupUrlScanner() {
  const scanBtn = document.getElementById('scan-btn');
  const urlInput = document.getElementById('url-input');
  const resultDiv = document.getElementById('urlscan-result');

  if (!scanBtn || !urlInput || !resultDiv) {
    console.error('❌ Elementos del DOM no encontrados.');
    return;
  }

  scanBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    const apiKey = '01975557-a119-7024-a795-b4f0c8b36d56'; // 🔐 Sustituye esto con tu clave

    console.log('🔍 Escanear clicado:', url);

    if (!url || !isValidUrl(url)) {
      showResult('Introduce una URL válida (ej: https://ejemplo.com)', 'error');
      return;
    }

    showResult('Escaneando URL... Esto puede tomar 10-20 segundos.', 'loading');

    try {
      const scanResponse = await fetch('https://urlscan.io/api/v1/scan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': apiKey
        },
        body: JSON.stringify({ url, public: true })
      });

      const scanData = await scanResponse.json();
      if (!scanData.uuid) throw new Error('No se pudo iniciar escaneo');

      let resultData;
      for (let i = 0; i < 10; i++) {
        const resultResponse = await fetch(`https://urlscan.io/api/v1/result/${scanData.uuid}/`);
        resultData = await resultResponse.json();

        if (resultData.status === 'success') {
          break;
        }

        if (i === 9) throw new Error('Escaneo no completado en el tiempo esperado');

        console.log(`🔄 Intento ${i + 1}: Escaneo en progreso...`);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos antes de reintentar
      }

      const malicious = resultData.verdicts?.overall?.malicious;
      const score = resultData.verdicts?.urlscan?.score || 0;

      showResult(`
      <h3>Resultados para ${url}</h3>
      <p>Estado: <strong>${malicious ? '⚠️ MALICIOSO' : '✅ Seguro'}</strong></p>
      <p>Score de riesgo: ${score}/100</p>
      <p>Motores detectados: ${resultData.verdicts?.engines?.detected || 0}</p>
      <a href="${resultData.task?.reportURL}" target="_blank">Ver informe completo</a>
    `, malicious ? 'error' : 'success');

    } catch (error) {
      showResult(`Error: ${error.message}<br>Intenta manualmente en <a href="https://urlscan.io" target="_blank">urlscan.io</a>`, 'error');
    }
  });

  function isValidUrl(string) {
    try { new URL(string); return true; }
    catch (_) { return false; }
  }

  function showResult(message, type) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = message;
    resultDiv.className = `result-container ${type}`;
  }
}

setupUrlScanner();

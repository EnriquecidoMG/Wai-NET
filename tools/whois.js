console.log('✅ whois.js cargado');

function setupWhoisLookup() {
  const whoisBtn = document.getElementById('whois-btn');
  const domainInput = document.getElementById('domain-input');
  const resultDiv = document.getElementById('whois-result');

  if (!whoisBtn || !domainInput || !resultDiv) {
    console.error('❌ Elementos del DOM no encontrados.');
    return;
  }

  whoisBtn.addEventListener('click', async () => {
    const domain = domainInput.value.trim();
    console.log('🔍 Whois clicado:', domain);

    if (!domain) {
      showResult('Introduce un dominio válido (ej: ejemplo.com)', 'error');
      return;
    }

    showResult('Buscando información WHOIS...', 'loading');

    try {
      const response = await fetch(`https://whoisjson.com/api/v1/whois?domain=${encodeURIComponent(domain)}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error.message);

      const created = data.created_date ? new Date(data.created_date).toLocaleDateString() : 'Desconocida';
      const expires = data.expires_date ? new Date(data.expires_date).toLocaleDateString() : 'Desconocida';

      showResult(`
        <h3>WHOIS para ${domain}</h3>
        <p><strong>Registrador:</strong> ${data.registrar || 'Desconocido'}</p>
        <p><strong>Fecha creación:</strong> ${created}</p>
        <p><strong>Fecha expiración:</strong> ${expires}</p>
        <p><strong>Servidores DNS:</strong> ${data.name_servers?.join(', ') || 'Desconocidos'}</p>
        <details>
          <summary>Ver datos completos</summary>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </details>
      `, 'success');

    } catch (error) {
      showResult(`Error: ${error.message}<br>Alternativa: <a href="https://whois.domaintools.com/${domain}" target="_blank">DomainTools</a>`, 'error');
    }
  });

  function showResult(message, type) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = message;
    resultDiv.className = `result-container ${type}`;
  }
}

// Ejecutar inmediatamente después de cargar el script
setupWhoisLookup();

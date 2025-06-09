(() => {
  const analyzeBtn = document.getElementById('analyze-btn');
  const fileInput = document.getElementById('file-input');
  const resultDiv = document.getElementById('metadata-result');

  analyzeBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) {
      showResult('Selecciona un archivo primero', 'error');
      return;
    }

    showResult('Analizando archivo...', 'loading');

    // Leer información básica del archivo
    const basicInfo = {
      'Nombre': file.name,
      'Tipo': file.type || 'Desconocido',
      'Tamaño': `${(file.size / 1024).toFixed(2)} KB`,
      'Última modificación': new Date(file.lastModified).toLocaleString()
    };

    // Leer metadatos específicos según tipo de archivo
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        let metadata = {};

        // Analizar EXIF para imágenes
        if (file.type.startsWith('image/')) {
          const exif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result));
          if (exif) metadata = { ...metadata, ...exif };
        }

        // Mostrar resultados
        showResult(`
          <h3>Metadatos para ${file.name}</h3>
          <h4>Información básica</h4>
          <pre>${JSON.stringify(basicInfo, null, 2)}</pre>
          ${Object.keys(metadata).length > 0 ? `
            <h4>Metadatos EXIF</h4>
            <pre>${JSON.stringify(metadata, null, 2)}</pre>
          ` : '<p>No se encontraron metadatos EXIF</p>'}
          <p class="warning">⚠️ Los metadatos pueden contener información sensible como ubicación.</p>
        `, 'success');

      } catch (error) {
        showResult(`
          <h3>Metadatos básicos</h3>
          <pre>${JSON.stringify(basicInfo, null, 2)}</pre>
          <p class="error">Error al leer metadatos específicos: ${error.message}</p>
        `, 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  });

  function showResult(message, type) {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = message;
    resultDiv.className = `result-container ${type}`;
  }
})();

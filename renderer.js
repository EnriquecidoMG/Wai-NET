document.addEventListener('DOMContentLoaded', () => {
  const pageContainer = document.getElementById('page-container');
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      await loadPage(page);

      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');
    });
  });

  async function loadPage(page) {
    try {
      const response = await fetch(`tools/${page}.html`);
      const html = await response.text();
      pageContainer.innerHTML = html;

      const script = document.createElement('script');
      script.src = `tools/${page}.js`;
      document.body.appendChild(script);
    } catch (error) {
      pageContainer.innerHTML = `<p>Error cargando la página: ${error.message}</p>`;
    }
  }

  // Página inicial:
  loadPage('home'); // Cambia esto si quieres que el generador sea la primera página
});

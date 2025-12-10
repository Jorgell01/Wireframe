// Simple SPA router: loads views into #app and manages sidebar state
(function () {
  const routes = {
    '': '/views/home.html',
    '#/dashboard': '/views/home.html',
    '#/productos': '/views/productos.html',
    '#/producto': '/views/producto.html',
    '#/recepcion': '/views/recepcion.html',
    '#/salida': '/views/salida.html',
    '#/pedido-final': '/views/pedido_final.html',
    '#/pedidos-profesores': '/views/pedidos_profesores.html',
    '#/categorias': '/views/categorias.html',
    '#/proveedores': '/views/proveedores.html'
  };

  const appEl = () => document.getElementById('app');

  async function loadView(path) {
    const app = appEl();
    if (!app) return;
    try {
      let file = routes[path] || '/views/home.html';
      // Dynamic route: #/producto/:id
      if (path.startsWith('#/producto/')) {
        file = routes['#/producto'];
      }
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      app.innerHTML = await res.text();
      // Execute inline/external scripts found in the loaded view
      Array.from(app.querySelectorAll('script')).forEach(old => {
        const s = document.createElement('script');
        if (old.src) {
          s.src = old.src;
          s.async = false;
        } else {
          s.textContent = old.textContent;
        }
        document.body.appendChild(s);
      });
    } catch (e) {
      app.innerHTML = `<div style="padding:12px;background:#fff3f2;border-radius:8px;color:#7a1f0d;">Error loading view: ${e.message}</div>`;
      console.error(e);
    }
  }

  function setActiveLink() {
    const links = document.querySelectorAll('.sidebar__link');
    const hash = location.hash || '#/dashboard';
    links.forEach(a => {
      if (a.getAttribute('href') === hash) a.classList.add('is-active'); else a.classList.remove('is-active');
    });
  }

  function onNavClick(e) {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return; // external link
    e.preventDefault();
    history.pushState(null, '', href);
    router.render();
  }

  const router = {
    async render() {
      const path = location.hash || '#/dashboard';
      await loadView(path);
      setActiveLink();
    },
    init() {
      // Delegate clicks from sidebar
      const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.addEventListener('click', onNavClick);
      } else {
        document.addEventListener('click', onNavClick);
      }

      window.addEventListener('popstate', () => this.render());
      window.addEventListener('hashchange', () => this.render());
      // render initial
      this.render();
    }
  };

  // Expose router globally so other scripts can call init after fragments load
  window.router = router;

  // If fragments were loaded before router was parsed, listen to the event
  window.addEventListener('fragments:loaded', () => {
    if (window.router && typeof window.router.init === 'function') window.router.init();
  });

  // Also init when DOM is ready (in case fragments are already present)
  document.addEventListener('DOMContentLoaded', () => {
    // Small timeout allows fragments inserted by dashboard.js to be parsed
    setTimeout(() => {
      if (document.getElementById('sidebar')) router.init();
    }, 50);
  });

})();

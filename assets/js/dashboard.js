document.addEventListener("DOMContentLoaded", async () => {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) { location.href = "login.html"; return; }

  const loadFragment = async (id, url) => {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      el.innerHTML = html;
      // Ejecutar scripts incluidos en el fragmento (los navegadores no ejecutan scripts añadidos vía innerHTML)
      try {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const scripts = temp.querySelectorAll('script');
        scripts.forEach(s => {
          const newScript = document.createElement('script');
          if (s.src) {
            newScript.src = s.src;
            newScript.async = false;
          } else {
            newScript.textContent = s.textContent;
          }
          document.body.appendChild(newScript);
        });
      } catch (e) {
        console.warn('No se pudieron ejecutar scripts del fragmento', e);
      }
    } catch (e) {
      el.innerHTML = `<div style="padding:10px;border:1px solid #ef4444;border-radius:8px;">Error cargando ${url}: ${e.message}</div>`;
      console.error(e);
    }
  };

  // Espera a que los fragments se carguen para que el router pueda enlazar enlaces dinámicos
  await loadFragment("mainHeader", "../components/header.html");
  await loadFragment("sidebar", "../components/sidebar.html");
  await loadFragment("mainFooter", "../components/footer.html");

  // Muestra usuario en contenido principal si tienes <span id="userName">
  const userNameEl = document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = usuario;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Si el router está disponible, inicializarlo para enlazar rutas y activar links
  if (window.router && typeof window.router.init === 'function') {
    window.router.init();
  } else {
    // emitir un evento por si el router se inicializa después
    window.dispatchEvent(new Event('fragments:loaded'));
  }
});

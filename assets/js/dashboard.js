document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) { location.href = "login.html"; return; }

  const loadFragment = async (id, url) => {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
    } catch (e) {
      el.innerHTML = `<div style="padding:10px;border:1px solid #ef4444;border-radius:8px;">Error cargando ${url}: ${e.message}</div>`;
      console.error(e);
    }
  };

  loadFragment("mainHeader", "../components/header.html");
  loadFragment("sidebar", "../components/sidebar.html");
  loadFragment("mainFooter", "../components/footer.html");

  // Muestra usuario en contenido principal si tienes <span id="userName">
  const userNameEl = document.getElementById("userName");
  if (userNameEl) userNameEl.textContent = usuario;
});

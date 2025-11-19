// Simple SPA router: carga vistas en #app y gestiona el estado de sidebar
(function () {
  const routes = {
    '': 'home.html',
    '#/dashboard': 'home.html',
    '#/productos': 'productos.html',
    '#/categorias': 'categorias.html',
    '#/proveedores': 'proveedores.html'
  };

  const appEl = () => document.getElementById('app');

  async function loadView(path) {
    const app = appEl();
    if (!app) return;
    try {
      const file = routes[path] || 'home.html';
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      app.innerHTML = await res.text();
      // after inserting view, run any inline scripts in the loaded HTML
      Array.from(app.querySelectorAll('script')).forEach(old => {
        const s = document.createElement('script');
        if (old.src) s.src = old.src;
        else s.textContent = old.textContent;
        document.body.appendChild(s);
        s.parentNode && s.parentNode.removeChild(s);
      });
    } catch (e) {
      app.innerHTML = `<div style="padding:12px;background:#fff3f2;border-radius:8px;color:#7a1f0d;">Error cargando la vista: ${e.message}</div>`;
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
    if (!href || !href.startsWith('#')) return; // external
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
      // delegate clicks from sidebar
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
    // small timeout allows fragments inserted by dashboard.js to be parsed
    setTimeout(() => {
      if (document.getElementById('sidebar')) router.init();
    }, 50);
  });

})();
// Rutas -> función que devuelve HTML (string)
const routes = {
  "/dashboard": renderDashboardHome,
  "/productos": renderProductos,
  "/categorias": renderCategorias,
  "/proveedores": renderProveedores,
};

function getCurrentPath() {
  const hash = window.location.hash || "#/dashboard";
  return hash.replace("#", "");
}

function setActiveLink(path) {
  const links = document.querySelectorAll(".sidebar__link");
  links.forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("is-active", href === `#${path}`);
  });
}

async function router() {
  const usuario = localStorage.getItem("usuario");
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  const path = getCurrentPath();
  const viewFn = routes[path] || renderNotFound;
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `<p>Cargando...</p>`;
  setActiveLink(path);

  try {
    const html = await viewFn();
    app.innerHTML = html;

    // 👇 Hooks por vista
    if (path === "/dashboard") {
      initDashboardCards();
    }
    if (path === "/productos") {
      initProductosView();
    }
  } catch (err) {
    console.error(err);
    app.innerHTML = `<p style="color:#f87171;">Error: ${err.message}</p>`;
  }
}

function initDashboardCards() {
  document.querySelectorAll(".card-link").forEach(card => {
    card.addEventListener("click", () => {
      const route = card.getAttribute("data-route");
      if (route) {
        window.location.hash = route;
      }
    });
  });
}

/* ===== VISTAS ===== */

async function renderDashboardHome() {
  const productos = await window.Api.getProductos();
  const categorias = await window.Api.getCategorias();
  const proveedores = await window.Api.getProveedores();

  const totalProductos = productos.length;
  const totalCategorias = categorias.length;
  const totalProveedores = proveedores.length;

  return `
    <div class="cards">
      <div class="card card-link" data-route="#/productos">
        <h3>📦 Productos</h3>
        <p>${totalProductos} registrados</p>
      </div>

      <div class="card card-link" data-route="#/categorias">
        <h3>🗂 Categorías</h3>
        <p>${totalCategorias} disponibles</p>
      </div>

      <div class="card card-link" data-route="#/proveedores">
        <h3>🏭 Proveedores</h3>
        <p>${totalProveedores} activos</p>
      </div>
    </div>
  `;
}

async function renderProductos() {
  const productos = await window.Api.getProductos();
  const categorias = await window.Api.getCategorias();
  const proveedores = await window.Api.getProveedores();

  // Guardamos cache en window para usar en edición
  window._productosCache = productos;
  window._categoriasCache = categorias;
  window._proveedoresCache = proveedores;

  const catById = Object.fromEntries(categorias.map(c => [c.id, c.nombre]));
  const provById = Object.fromEntries(proveedores.map(p => [p.id, p.nombre]));

  const rows = productos.map(p => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${catById[String(p.categoriaId)] || p.categoria?.nombre || "Desconocida"}</td>
      <td>${provById[String(p.proveedorId)] || p.proveedor?.nombre || "Desconocido"}</td>
      <td>${p.precio} ${p.unidadMedida || ""}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn-small btn-edit" data-id="${p.id}">Editar</button>
        <button class="btn-small btn-delete" data-id="${p.id}">Borrar</button>
      </td>
    </tr>
  `).join("");

  const categoriaOptions = categorias.map(c => `
    <option value="${c.id}">${c.nombre}</option>
  `).join("");

  const proveedorOptions = proveedores.map(p => `
    <option value="${p.id}">${p.nombre}</option>
  `).join("");

  return `
    <h2>📦 Productos</h2>

    <div class="product-form-wrapper">
      <h3 id="productoFormTitle">Añadir producto</h3>
      <form id="productoForm">
        <input type="hidden" id="productoId" />

        <div class="form-row">
          <label>Nombre</label>
          <input type="text" id="productoNombre" required />
        </div>

        <div class="form-row">
          <label>Categoría</label>
          <select id="productoCategoriaId" required>
            <option value="">Selecciona una categoría</option>
            ${categoriaOptions}
          </select>
        </div>

        <div class="form-row">
          <label>Proveedor</label>
          <select id="productoProveedorId" required>
            <option value="">Selecciona un proveedor</option>
            ${proveedorOptions}
          </select>
        </div>

        <div class="form-row">
          <label>Precio</label>
          <input type="number" id="productoPrecio" step="0.01" required />
        </div>

        <div class="form-row">
          <label>Stock</label>
          <input type="number" id="productoStock" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" id="productoSubmitBtn">Guardar</button>
          <button type="button" class="btn-secondary" id="productoResetBtn">Limpiar</button>
        </div>
      </form>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function renderCategorias() {
  const categorias = await window.Api.getCategorias();

  if (!categorias.length) return `<p>No hay categorías registradas.</p>`;

  const items = categorias.map(c => `
    <li class="list-item">
      <strong>${c.nombre}</strong><br>
      <small>${c.descripcion || ""}</small>
    </li>
  `).join("");

  return `
    <h2>🗂 Categorías</h2>
    <ul class="list">
      ${items}
    </ul>
  `;
}

async function renderProveedores() {
  const proveedores = await window.Api.getProveedores();

  if (!proveedores.length) return `<p>No hay proveedores registrados.</p>`;

  const rows = proveedores.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.contacto}</td>
      <td>${p.telefono}</td>
      <td>${p.email}</td>
    </tr>
  `).join("");

  return `
    <h2>🏭 Proveedores</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Contacto</th>
          <th>Teléfono</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function renderNotFound() {
  return `<h2>404 • Página no encontrada</h2>`;
}

function initProductosView() {
  const form = document.getElementById("productoForm");
  const title = document.getElementById("productoFormTitle");
  const idInput = document.getElementById("productoId");
  const nombreInput = document.getElementById("productoNombre");
  const categoriaSelect = document.getElementById("productoCategoriaId");
  const proveedorSelect = document.getElementById("productoProveedorId");
  const precioInput = document.getElementById("productoPrecio");
  const stockInput = document.getElementById("productoStock");
  const resetBtn = document.getElementById("productoResetBtn");
  const submitBtn = document.getElementById("productoSubmitBtn");

  if (!form) return;

  // Modo actual: "create" o "edit"
  let mode = "create";

  function resetForm() {
    mode = "create";
    title.textContent = "Añadir producto";
    submitBtn.textContent = "Guardar";
    idInput.value = "";
    form.reset();
  }

  resetBtn.addEventListener("click", () => {
    resetForm();
  });

  // Enviar formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      nombre: nombreInput.value.trim(),
      categoriaId: Number(categoriaSelect.value),
      proveedorId: Number(proveedorSelect.value),
      precio: Number(precioInput.value),
      stock: Number(stockInput.value),
    };

    try {
      if (mode === "create") {
        await window.Api.createProducto(payload);
      } else if (mode === "edit") {
        const id = idInput.value;
        await window.Api.updateProducto(id, {
          id, // mantener id
          ...payload,
        });
      }

      // Volver a cargar la vista de productos
      window.location.hash = "#/productos";
    } catch (err) {
      console.error(err);
      alert("Error al guardar el producto: " + err.message);
    }
  });

  // Botones editar/borrar
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm(`¿Seguro que quieres borrar el producto ${id}?`)) return;

      try {
        await window.Api.deleteProducto(id);
        window.location.hash = "#/productos";
      } catch (err) {
        console.error(err);
        alert("Error al borrar el producto: " + err.message);
      }
    });
  });

  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const productos = window._productosCache || [];
      const p = productos.find(x => String(x.id) === String(id));
      if (!p) return;

      mode = "edit";
      title.textContent = `Editar producto #${id}`;
      submitBtn.textContent = "Actualizar";

      idInput.value = p.id;
      nombreInput.value = p.nombre || "";
      categoriaSelect.value = String(p.categoriaId);
      proveedorSelect.value = String(p.proveedorId);
      precioInput.value = p.precio;
      stockInput.value = p.stock;
      // scroll al formulario
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);

// API helper: define base URL for json-server and simple helpers
(function(){
  // Detectar entorno local y apuntar al puerto usado por el script `api` en package.json
  const defaultLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  window.API_BASE = defaultLocal ? 'http://localhost:3001' : '';

  window.API = {
    get: (path) => fetch((window.API_BASE || '') + path, { cache: 'no-cache' }),
    post: (path, body) => fetch((window.API_BASE || '') + path, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }),
    put: (path, body) => fetch((window.API_BASE || '') + path, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) }),
    del: (path) => fetch((window.API_BASE || '') + path, { method: 'DELETE' })
  };

})();
// assets/js/api.js
const API_BASE_URL = "http://localhost:3001";

async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status} en ${endpoint}: ${msg}`);
  }

  // json-server devuelve JSON en todas las operaciones
  return res.json();
}

async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: "GET" });
}

async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

async function apiDelete(endpoint) {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}

// API "global"
window.Api = {
  // GET
  getProductos: () => apiGet("/productos"),
  getCategorias: () => apiGet("/categorias"),
  getProveedores: () => apiGet("/proveedores"),

  // CRUD Productos
  createProducto: (producto) => apiPost("/productos", producto),
  updateProducto: (id, producto) => apiPut(`/productos/${id}`, producto),
  deleteProducto: (id) => apiDelete(`/productos/${id}`),
};

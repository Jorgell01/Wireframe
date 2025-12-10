## 🎯 Resumen

Wireframe es una SPA (Single Page Application) en HTML/CSS/JS que simula un sistema de inventario con login y panel de control. A día de hoy incluye gestión de productos con imágenes y detalles, integración con Open Food Facts (OFF), soporte para escáner de códigos de barras (HID) y un router por hash.

Principales objetivos (estado actual):
- Arquitectura modular con componentes (header, sidebar, footer) y router hash-based.
- Autenticación client-side con usuarios persistidos en `localStorage` y sesión por cookie `wf_session`.
- Gestión de productos: listado con filtros, edición/creación, imágenes, peso/unidades, precio/unidades, proveedor/categoría y descripción.
- Integración OFF para autocompletar nombre/imagen a partir del código.
- Soporte de escáner HID: captura del código y eventos globales.

---

## ✨ Características principales

- SPA con router por hash (`assets/js/router.js`), incluye ruta dinámica `#/producto/:id`.
- Productos: tabla con paginación (Simple-DataTables), filtros (texto, categoría, proveedor, precio), miniaturas con lazy-load y modal de detalles.
- Formulario de producto: código, nombre, descripción, imagen, peso + unidad, precio + unidad, stock mínimo y actual, categoría/proveedor; guarda vía `window.API`.
- Vista dedicada del producto (`views/producto.html`) con edición/borrado y retorno directo a `#/productos` abriendo la edición.
- Open Food Facts: botón OFF que consulta por código y rellena nombre/imagen.
- Escáner HID: input oculto + eventos `barcodeScanned` y `scannerReady`, API `window.Scanner`.
- Autenticación: `window.Auth` con registro/login/logout; usuarios y sesiones en `localStorage` y cookie `wf_session`.

---

## 🚀 Quick Start (Windows)

1) Servir el frontend (estático):
 - Abre `index.html` con Live Server (VS Code) o doble clic.

2) Mock API (`json-server`):

```bat
cd c:\Users\Jorge\Documents\GitHub\DOR\Wireframe
npm install
npm run api
```

Esto expone `http://localhost:3001` leyendo `data/db.json`. `window.API` lo detecta automáticamente en local.

Login/Registro:
- Registra usuario en `#/register` o usa uno existente.
- `window.Auth` persiste usuarios en `localStorage` (`wf_users`) y sesiones (`wf_sessions` + cookie `wf_session`).
=======
Al iniciar sesión correctamente, el proyecto guarda el nombre de usuario en `localStorage` y redirige a `dashboard.html`.

---

## 📦 Estructura del proyecto

Contenido principal (raíz):

- `index.html` — entrypoint; redirige a `views/dashboard.html` y carga `scanner.js`.
- `views/*.html` — vistas: `dashboard.html`, `productos.html`, `producto.html`, `login.html`, `register.html`, etc.
- `assets/` — recursos estáticos
  - `css/` — estilos (`style.css`, `login.css`, `dashboard.css`)
  - `fonts/`, `img/` — tipografías y imágenes
  - `js/` — scripts principales: `router.js`, `api.js`, `scanner.js`, `login.js`, `register.js`, `dashboard.js`, etc.
- `components/` — componentes HTML parciales (`header.html`, `sidebar.html`, `footer.html`) cargados dinámicamente
- `views/` — vistas SPA cargadas por el router.
- `data/` — `db.json` para `json-server`.
- `utils/` — utilidades futuras.

---

## 🧩 Componentes y Router

- `components/header.html`, `components/sidebar.html`, `components/footer.html` — fragmentos HTML que se insertan en las vistas mediante JavaScript y `fetch()`.
- `assets/js/router.js` — mapea hashes a vistas, reinyecta scripts, marca activo el sidebar, soporta `#/producto/:id`.
- `assets/js/api.js` — `window.API` (GET/POST/PUT/DELETE) y `window.Auth` (registro/login/logout).
- `assets/js/scanner.js` — input oculto + eventos `barcodeScanned`/`scannerReady` y `window.Scanner`.

---

## 🛠️ Desarrollo

Para desarrollar localmente:

1. Abrir el proyecto en VS Code.
2. Instalar Live Server si quieres recarga en caliente.
3. Abrir `index.html` con Live Server.

Pruebas útiles:
- Productos: `#/productos` para filtros, edición y OFF.
- Detalle: `#/producto/{id}` para vista completa.
- Escáner: al abrir el formulario de producto, verás “Escáner listo” y el campo `Código` se auto-rellena al escanear.
- Login/Register: `#/login` y `#/register` (persistencia en `localStorage`).

---

## ✅ Roadmap

- Tema claro/oscuro con variables CSS.
- Mejorar diseño responsive (móvil / tablet).
- Recepción/Salida: lote manual, comprobación con pedido y flujo “Salida inmediata” con deshacer.
- Endurecer auth: backend real o JWT, cookies `HttpOnly/Secure/SameSite`.
- Indicadores de escáner reutilizables en Recepción/Salida.
- Tests y CI básicos.

---

## 👤 Autor

Jorge A. Herrero Santana (Pude)

Proyecto Intermodular — 2025
IES Canarias

## 🎯 Resumen

Wireframe es un prototipo modular construido con HTML, CSS y JavaScript puro que simula una aplicación web con pantalla de login y panel de control (dashboard). Está pensado como base educativa y como punto de partida para convertirlo en una app real con backend o framework.

Principales objetivos:
- Mostrar una arquitectura de componentes (header, sidebar, footer) cargados dinámicamente.
- Simular un flujo de autenticación usando `localStorage`.
- Mantener código y estilos organizados y fácilmente ampliables.

---

## ✨ Características principales

- Estructura modular: componentes reutilizables (`header`, `sidebar`, `footer`) cargados con `fetch()`.
- Login simulado: credenciales de ejemplo y sesión en `localStorage`.
- Dashboard funcional: bienvenida al usuario y módulos de ejemplo.
- CSS organizado: estilos globales (`style.css`) y específicos (`login.css`, `dashboard.css`).
- Documentación mínima y lista para escalar.

---

## 🚀 Quick Start (Windows)

1. Clona el repositorio y abre la carpeta del proyecto en Visual Studio Code.

2. Abre `index.html` con Live Server (extensión de VS Code) o sirve la carpeta con cualquier servidor estático.

Ejemplo con Live Server: clic derecho sobre `index.html` → "Open with Live Server".

Credenciales por defecto (simuladas):
- Usuario: `admin`
- Contraseña: `1234`

Al iniciar sesión correctamente, el proyecto guarda el nombre de usuario en `localStorage` y redirige a `dashboard.html`.

---

## �️ Estructura del proyecto

Contenido principal (raíz):

- `index.html` — punto de entrada (redirige o muestra vista inicial)
- `login.html` — vista de inicio de sesión
- `dashboard.html` — vista del panel de control
- `assets/` — recursos estáticos
  - `css/` — estilos (`style.css`, `login.css`, `dashboard.css`)
  - `fonts/`, `img/` — tipografías y imágenes
  - `js/` — scripts principales (`login.js`, `dashboard.js`)
- `components/` — componentes HTML parciales (`header.html`, `sidebar.html`, `footer.html`) cargados dinámicamente
- `views/` — vistas o plantillas adicionales
- `data/`, `utils/` — espacio para datos y utilidades (vacíos/ejemplo)

---

## � Componentes y cómo funcionan

- `components/header.html`, `components/sidebar.html`, `components/footer.html` — fragmentos HTML que se insertan en las vistas mediante JavaScript y `fetch()`.
- `js/login.js` — maneja la lógica de autenticación simulada y el guardado en `localStorage`.
- `js/dashboard.js` — obtiene el usuario desde `localStorage`, actualiza la UI y habilita la acción de cerrar sesión.

Consejo: Si amplías el proyecto, considera separar la lógica en módulos ES y usar un pequeño bundler cuando escale.

---

## 🛠️ Desarrollo

Para desarrollar localmente:

1. Abrir el proyecto en VS Code.
2. Instalar Live Server si quieres recarga en caliente.
3. Abrir `index.html` o `login.html` con Live Server.

Recomendaciones futuras:
- Añadir validación y manejo de errores en el login.
- Implementar un archivo `config` para las rutas y credenciales de prueba.
- Introducir un pequeño script de `npm` si añades herramientas de build.

---

## ✅ Siguientes mejoras (Roadmap)

- Tema claro/oscuro con variables CSS.
- Mejorar diseño responsive (móvil / tablet).
- Formulario de registro y gestión de usuarios (simulado o real).
- Integración con un backend o API simulada.
- Gestión de módulos dinámicos desde el dashboard.

---

## 🤝 Contribuciones

Pequeñas contribuciones son bienvenidas. Para cambios mayores, abre un issue con la propuesta y luego un pull request.

Buenas prácticas para contribuir:
- Mantener estilo y estructura existentes.
- Añadir pruebas o ejemplos cuando cambies la lógica.

---

## � Licencia

Este repositorio no incluye un archivo de licencia explícito. Si deseas compartirlo públicamente, considera añadir una licencia (por ejemplo MIT) y un archivo `LICENSE`.

---

## � Autor

Jorge A. Herrero Santana (Pude)

Proyecto Intermodular — 2025
IES Canarias

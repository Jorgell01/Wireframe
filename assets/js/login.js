document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const error = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === "admin" && password === "1234") {
      localStorage.setItem("usuario", username);
      window.location.href = "dashboard.html";
    } else {
      error.textContent = "Usuario o contraseña incorrectos";
    }
  });
});
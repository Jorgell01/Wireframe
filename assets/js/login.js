document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const error = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    error.textContent = '';
    try {
      if (!window.Auth || typeof window.Auth.loginUser !== 'function') throw new Error('Auth no disponible');
      const res = await window.Auth.loginUser({ username, password });
      // store a friendly username in localStorage for header display
      try { localStorage.setItem('usuario', res.user.username); } catch(_){}
      // redirect to main app
      window.location.href = '../index.html';
    } catch (err) {
      error.textContent = err.message || 'Error en autenticación';
    }
  });
});
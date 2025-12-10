document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const error = document.getElementById('r-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.textContent = '';
    const username = document.getElementById('r-username').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const password = document.getElementById('r-password').value;
    const password2 = document.getElementById('r-password2').value;

    if (password !== password2) { error.textContent = 'Passwords do not match'; return; }
    try {
      if (!window.Auth || typeof window.Auth.registerUser !== 'function') throw new Error('Auth not available');
      const user = await window.Auth.registerUser({ username, email, password });
      // Auto-login: call loginUser
      await window.Auth.loginUser({ username, password });
      try { localStorage.setItem('usuario', username); } catch(_){}
      window.location.href = '../index.html';
    } catch (err) {
      error.textContent = err.message || 'Error registering user';
    }
  });
});
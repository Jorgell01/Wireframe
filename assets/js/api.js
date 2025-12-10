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

/* ======= Auth helpers (client-side users store + cookie sessions) ======= */
(function(){
  const USERS_KEY = 'wf_users';
  const SESSIONS_KEY = 'wf_sessions';

  function readUsers(){
    try{ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }catch(e){ return []; }
  }

  function writeUsers(u){ localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function readSessions(){ try{ return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '{}'); }catch(e){ return {}; } }
  function writeSessions(s){ localStorage.setItem(SESSIONS_KEY, JSON.stringify(s)); }

  function arrayBufferToHex(buff){ return Array.from(new Uint8Array(buff)).map(b=>b.toString(16).padStart(2,'0')).join(''); }

  async function hashPassword(password, salt){
    const enc = new TextEncoder();
    const data = enc.encode(password + salt);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return arrayBufferToHex(hash);
  }

  function randomId(){ return (Date.now().toString(36) + Math.random().toString(36).slice(2,9)); }

  function setCookie(name, value, days){
    const expires = days ? '; expires=' + new Date(Date.now()+days*864e5).toUTCString() : '';
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
  }

  function getCookie(name){
    return document.cookie.split('; ').reduce((acc, cur) => { const [k,v]=cur.split('='); if(k===name) acc = decodeURIComponent(v); return acc; }, '');
  }

  function deleteCookie(name){ document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'; }

  async function registerUser({username, email, password}){
    if (!username || !password) throw new Error('Username and password required');
    const users = readUsers();
    if (users.find(u=>u.username===username || (email && u.email===email))) throw new Error('Usuario ya existente');
    const salt = randomId();
    const pwdHash = await hashPassword(password, salt);
    const user = { id: randomId(), username, email: email||'', salt, pwdHash, createdAt: new Date().toISOString() };
    users.push(user); writeUsers(users);
    return { id: user.id, username: user.username, email: user.email };
  }

  async function loginUser({username, password}){
    const users = readUsers();
    const user = users.find(u=>u.username===username);
    if (!user) throw new Error('Usuario o contraseña incorrectos');
    const tryHash = await hashPassword(password, user.salt);
    if (tryHash !== user.pwdHash) throw new Error('Usuario o contraseña incorrectos');

    // create session token
    const token = randomId() + '.' + randomId();
    const sessions = readSessions();
    // expiry 7 days
    sessions[token] = { userId: user.id, expires: Date.now() + 7*24*3600*1000 };
    writeSessions(sessions);
    setCookie('wf_session', token, 7);
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  function logout(){
    const token = getCookie('wf_session');
    if (!token) return;
    const sessions = readSessions();
    delete sessions[token]; writeSessions(sessions);
    deleteCookie('wf_session');
  }

  function getCurrentUser(){
    const token = getCookie('wf_session');
    if (!token) return null;
    const sessions = readSessions();
    const s = sessions[token];
    if (!s) return null;
    if (Date.now() > s.expires){ delete sessions[token]; writeSessions(sessions); deleteCookie('wf_session'); return null; }
    const users = readUsers();
    const u = users.find(x=>x.id===s.userId);
    if (!u) return null;
    return { id: u.id, username: u.username, email: u.email };
  }

  // expose
  window.Auth = { registerUser, loginUser, logout, getCurrentUser };

})();

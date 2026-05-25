/**
 * authService.js
 * Mock authentication service — JWT-ready architecture.
 * Replace the simulateLogin function body with a real Axios call to your backend.
 */

const TOKEN_KEY = 'resqlink_admin_token';
const USER_KEY  = 'resqlink_admin_user';

// ─── Mock credentials (replace with real API) ────────────────────────────────
const MOCK_ADMIN = {
  email: 'admin@resqlink.org',
  password: 'admin123',
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@resqlink.org',
    role: 'Super Admin',
  },
};

/**
 * Simulate a login POST request.
 * In production, replace with:
 *   const res = await axios.post('/api/auth/login', { email, password });
 *   return res.data; // { token, user }
 */
export const simulateLogin = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        email.toLowerCase() === MOCK_ADMIN.email &&
        password === MOCK_ADMIN.password
      ) {
        const fakeToken = btoa(`${email}:${Date.now()}`);
        resolve({ token: fakeToken, user: MOCK_ADMIN.user });
      } else {
        reject(new Error('Invalid email or password.'));
      }
    }, 1000); // Simulate network latency
  });
};

// ─── Token helpers ─────────────────────────────────────────────────────────
export const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

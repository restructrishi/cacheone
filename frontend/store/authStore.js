/** Placeholder: auth state. Replace with context or Zustand/Redux for production. */
let listeners = [];

export const authStore = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  getUser: () => {
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    return u ? JSON.parse(u) : null;
  },
  setAuth: (user, token) => {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem('token', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    listeners.forEach((fn) => fn());
  },
  clearAuth: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    listeners.forEach((fn) => fn());
  },
  subscribe: (fn) => {
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  },
};

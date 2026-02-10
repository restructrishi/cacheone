import { useMemo } from 'react';

/** Placeholder: returns auth state from storage/context. Replace with real store/context. */
export function useAuth() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = useMemo(() => (userStr ? JSON.parse(userStr) : null), [userStr]);
  const isAuthenticated = Boolean(token);
  return { user, token, isAuthenticated };
}

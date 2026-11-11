import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, apiLogin } from '../lib/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  office: { id: number; name: string } | null;
  locale: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  can: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await apiFetch<{ data: AuthUser }>('/api/user');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setUser(res.data);
  }, []);

  const logout = useCallback(async () => {
    try { await apiFetch('/api/logout', { method: 'POST' }); } finally { setUser(null); }
  }, []);

  const can = useCallback(
    (permission: string) => !!user?.permissions.includes(permission),
    [user]
  );

  const hasRole = useCallback(
    (role: string) => !!user?.roles.includes(role),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh, can, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
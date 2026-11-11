import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [logout]);

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
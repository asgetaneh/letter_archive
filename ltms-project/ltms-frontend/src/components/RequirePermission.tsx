import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequirePermission({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const { can } = useAuth();
  if (!can(permission)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
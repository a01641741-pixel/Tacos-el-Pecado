import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function RoleRoute({ roles, email, redirect = '/' }) {
  const { user, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Email check — only that specific user
  if (email) {
    if (user.email !== email) return <Navigate to={redirect} replace />;
    return <Outlet />;
  }

  // Role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
    <div className="w-8 h-8 border-4 border-white/10 border-t-ember rounded-full animate-spin"></div>
  </div>
);

export default function GuestGate() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Outlet />;
  }

  const guestMode = sessionStorage.getItem('guestMode') === 'true';
  if (guestMode) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}

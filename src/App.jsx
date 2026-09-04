import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import { CartProvider } from '@/lib/cartContext';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Order from '@/pages/Order';
import Dashboard from '@/pages/Dashboard';
import Comandas from '@/pages/Comandas';
import Accesos from '@/pages/Accesos';
import RoleRoute from '@/components/RoleRoute';
import Landing from '@/pages/Landing';
import Ordenar from '@/pages/Ordenar';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isProtectedRoute = ['/panel', '/comandas', '/accesos'].some((path) => location.pathname.startsWith(path));

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors (but allow auth routes to render)
  if (authError && !isAuthRoute && isProtectedRoute) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
    }
  }

  // Render the main app
  return (
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/experiencia" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/ordenar" element={<Ordenar />} />
          <Route path="/pedido" element={<Order />} />
          <Route element={<RoleRoute roles={['admin', 'mesero']} />}>
            <Route path="/panel" element={<Dashboard />} />
            <Route path="/comandas" element={<Comandas />} />
          </Route>
          <Route element={<RoleRoute email="a01641741@tec.mx" />}>
            <Route path="/accesos" element={<Accesos />} />
          </Route>
            <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

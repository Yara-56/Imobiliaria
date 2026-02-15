import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../core/auth/hooks/useAuth";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return null; // Ou um Loading Spinner profissional

  if (!isAuthenticated) {
    // Salva a rota que o usuário tentou acessar para redirecionar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o usuário tem a "Role" necessária
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

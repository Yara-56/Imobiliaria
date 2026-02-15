import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Usando o contexto que criamos

interface RoleGuardProps {
  roles: string[];
}

export default function RoleGuard({ roles }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  // 1. Verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Verifica se o cargo do usuário está na lista permitida
  const hasPermission = user && roles.includes(user.role);

  if (!hasPermission) {
    // Se não tiver permissão, volta para a home segura da Dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
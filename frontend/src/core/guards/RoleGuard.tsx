import { Navigate, Outlet } from "react-router-dom";
// ✅ Ajustado para usar o hook centralizado e o alias @
import { useAuth } from "@/core/hooks/useAuth"; 

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
  // Convertemos roles para garantir que a comparação funcione mesmo com tipos diferentes
  const hasPermission = user && roles.includes(user.role);

  if (!hasPermission) {
    // Se não tiver permissão, redireciona para a home da Dashboard ou uma página de não autorizado
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext"; // Ajustei o caminho do import

interface RoleRouteProps {
  roles: UserRole[]; // Mudamos para 'roles' para bater com o AppRoutes
}

export default function RoleGuard({ roles }: RoleRouteProps) {
  const { user, loading } = useAuth();

  // 1. Enquanto o contexto lê o localStorage, não fazemos nada
  if (loading) {
    return null; // Ou um spinner de carregamento
  }

  // 2. Se não houver usuário ou a role não estiver na lista permitida
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Se estiver tudo ok, renderiza a rota filha
  return <Outlet />;
}
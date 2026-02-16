import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/core/context/AuthContext";
import type { UserRole } from "@/core/context/AuthContext";

interface RoleGuardProps {
  roles: UserRole[];
}

export default function RoleGuard({ roles }: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAuth();

  // Aguarda carregar auth
  if (loading) return null;

  // Não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sem cargo válido
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
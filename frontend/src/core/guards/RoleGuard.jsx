import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RoleGuard({ roles }) {
  const { hasRole } = useAuth();

  if (!hasRole(roles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

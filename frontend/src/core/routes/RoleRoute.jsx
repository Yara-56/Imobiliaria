import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

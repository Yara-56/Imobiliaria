import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // Simulação de estado de autenticação e cargo (Role)
  // Em um sistema real, isso viria de um Context ou Store (Zustand/Redux)
  const user = {
    isAuthenticated: true,
    role: "ADMIN" // Alinhado ao seu perfil de administradora do sistema
  };

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // O Outlet renderiza as rotas filhas definidas no AppRoutes
  return <Outlet />;
};

export default ProtectedRoute;
// src/core/guards/ProtectedRoute.tsx
import React, { FC } from "react";
import { Outlet, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuthenticated = true; // só teste
  const userRole = "USER";

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
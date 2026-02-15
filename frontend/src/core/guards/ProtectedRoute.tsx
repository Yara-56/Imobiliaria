import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// ✅ Ajustado: Apontando para o hook na pasta correta e usando o alias @
import { useAuth } from "@/core/hooks/useAuth"; 

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  // Nota: Removi o 'loading' pois no nosso AuthContext simplificado 
  // a verificação do localStorage é instantânea no useState.
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redireciona para o login salvando a rota de origem
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o usuário tem a permissão necessária
  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Verifica se existe usuário e token no localStorage
const getAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));
    if (user && token) return { user, token };
    return null;
  } catch (err) {
    return null;
  }
};

export default function ProtectedRoute({ children }) {
  const auth = getAuth();

  // Se não estiver logado, redireciona para login
  if (!auth) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se estiver logado, libera acesso
  return children;
}

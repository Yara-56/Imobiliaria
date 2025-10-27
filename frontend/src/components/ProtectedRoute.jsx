import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // --- LÓGICA DE LOGIN REATIVADA ---
  
  // 1. Busca o token no localStorage
  const token = localStorage.getItem('token');

  // 2. Verifica o token:
  //    - Se existir (truthy), renderiza o componente filho (children).
  //    - Se não existir (falsy), redireciona para a rota "/" (Login).
  return token ? children : <Navigate to="/" replace />;

  // --- MODIFICAÇÃO TEMPORÁRIA REMOVIDA ---
  // return children; 
  // --- FIM DA MODIFICAÇÃO TEMPORÁRIA ---
}
import React from "react";

/**
 * Bypass temporário para demo.
 * Permite acesso direto a qualquer rota sem login.
 * ⚠️ REMOVER após demonstração.
 */
export default function ProtectedRoute({ children }) {
  return children; // Libera qualquer componente sem checar token
}

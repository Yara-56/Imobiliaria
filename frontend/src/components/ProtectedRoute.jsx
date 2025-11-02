// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Permite bypass temporário quando a variável de ambiente de demo estiver ativa.
 * Suporta Vite (VITE_DEMO_BYPASS), CRA (REACT_APP_DEMO_BYPASS) e Next (NEXT_PUBLIC_DEMO_BYPASS).
 *
 * REMOVER/REVER depois da demo!
 */
export default function ProtectedRoute({ children }) {
  // 1) Leitura cross-tooling das env vars
  const envVars = {
    vite: typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_DEMO_BYPASS : undefined,
    cra: typeof process !== "undefined" && process.env ? process.env.REACT_APP_DEMO_BYPASS : undefined,
    next: typeof process !== "undefined" && process.env ? process.env.NEXT_PUBLIC_DEMO_BYPASS : undefined,
  };

  // 2) Normaliza qualquer valor string 'true' / '1' para boolean
  const parseFlag = (v) => {
    if (v === undefined || v === null) return false;
    if (typeof v === "boolean") return v;
    const s = String(v).toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes";
  };

  const demoBypass =
    parseFlag(envVars.vite) || parseFlag(envVars.cra) || parseFlag(envVars.next) ||
    (typeof window !== "undefined" && window.__DEMO_BYPASS === true);

  if (demoBypass) {
    return children;
  }

  // 3) Comportamento padrão: checa token no localStorage
  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  return token ? children : <Navigate to="/" replace />;
}

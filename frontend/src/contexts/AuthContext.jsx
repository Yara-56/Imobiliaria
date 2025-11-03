// src/contexts/AuthContext.jsx
import React, { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 🔥 Login completamente desativado — o usuário está sempre autenticado
  const value = {
    user: { name: "Acesso Livre" },
    login: () => {},
    logout: () => {},
    isAuthenticated: true,
    isReady: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

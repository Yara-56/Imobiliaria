// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔓 Versão DEMO: sem conexão com API, sem tokens
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ name: "Usuário Demo" }); // simula usuário logado
  const [isReady, setIsReady] = useState(true); // já inicia pronto
  const navigate = useNavigate();

  // 🔓 Login fictício — apenas salva um usuário demo
  const login = (userData = { name: "Usuário Demo" }, token = "demo-token") => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/admin/dashboard");
  };

  // 🔓 Logout fictício — só limpa localStorage e volta pro login
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/admin/login");
  };

  const isAuthenticated = !!user; // sempre true na demo

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

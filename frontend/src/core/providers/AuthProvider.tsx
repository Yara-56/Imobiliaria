// src/core/providers/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  // Recupera o usuário ao carregar o app
  useEffect(() => {
    const savedUser = localStorage.getItem("@ImobiSys:user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (email: string, pass: string) => {
    // Aqui você chamaria sua API real
    const mockUser = { email, role: "ADMIN", name: "Yara" }; 
    setUser(mockUser);
    localStorage.setItem("@ImobiSys:user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@ImobiSys:user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
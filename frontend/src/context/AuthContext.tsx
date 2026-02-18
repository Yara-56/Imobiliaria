"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  status: string;
  plan: "FREE" | "PRO";
  limits: {
    tenants: number;
    properties: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // ✅ Adicionado para resolver o erro no ProtectedRoute
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Começa como true

  useEffect(() => {
    const storedUser = localStorage.getItem("@ImobiSys:user");
    const storedToken = localStorage.getItem("@ImobiSys:token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Erro ao restaurar sessão:", error);
        localStorage.clear();
      }
    }
    
    // ✅ Finaliza o carregamento após verificar o localStorage
    setLoading(false); 
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("@ImobiSys:user", JSON.stringify(userData));
    localStorage.setItem("@ImobiSys:token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@ImobiSys:user");
    localStorage.removeItem("@ImobiSys:token");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!token, 
        loading, // ✅ Agora o ProtectedRoute consegue ler esta propriedade
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
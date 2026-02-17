"use client";

import {
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import api from "../core/api/api.ts"; // ✅ Importando sua instância configurada

export type UserRole = "ADMIN" | "OWNER" | "USER";

export interface User {
  id: string; // ✅ Obrigatório para o multi-tenancy
  name: string;
  role: UserRole;
  email: string;
  tenantId: string; // ✅ Essencial para filtrar os dados da sua avó
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Verifica a sessão de forma segura ao carregar o sistema
  useEffect(() => {
    const loadStorageData = () => {
      try {
        const savedUser = localStorage.getItem("imobisys_user");
        const savedToken = localStorage.getItem("imobisys_token");

        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // ✅ Sincroniza o header da API imediatamente
          api.defaults.headers.Authorization = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error("❌ Falha ao restaurar sessão:", error);
        localStorage.clear(); // Limpa lixo em caso de erro de parse
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("imobisys_user", JSON.stringify(userData));
    localStorage.setItem("imobisys_token", token);
    
    // ✅ Injeta o token na instância do Axios
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("imobisys_user");
    localStorage.removeItem("imobisys_token");
    
    // ✅ Remove o rastro de segurança da API
    delete api.defaults.headers.Authorization;
    setUser(null);
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return !!user && roles.includes(user.role);
  }, [user]);

  // ⚡ Memoriza o valor para evitar re-renderizações desnecessárias
  const value = useMemo(() => ({
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    loading,
  }), [user, login, logout, hasRole, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
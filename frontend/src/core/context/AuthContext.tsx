"use client";

import {
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useContext,
} from "react";

export type UserRole = "ADMIN" | "OWNER" | "USER";

export interface User {
  id?: string;
  name: string;
  role: UserRole;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  loading: boolean;
}

// ✅ Exportado para que o useAuth possa ser consumido
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("imobisys_user");
      const savedToken = localStorage.getItem("imobisys_token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("imobisys_user", JSON.stringify(userData));
    localStorage.setItem("imobisys_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("imobisys_user");
    localStorage.removeItem("imobisys_token");
  };

  const hasRole = (roles: UserRole[]) =>
    !!user && roles.includes(user?.role || "");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro de AuthProvider");
  return context;
};
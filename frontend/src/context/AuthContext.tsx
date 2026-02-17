"use client";

import {
  createContext,
  useState,
  ReactNode,
  FC,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import api from "@/core/api/api";

export type UserRole = "ADMIN" | "OWNER" | "USER";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  tenantId: string;
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

  // Restore session on load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("imobisys_user");
      const savedToken = localStorage.getItem("imobisys_token");

      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser) as User;
        setUser(parsedUser);
        api.defaults.headers.Authorization = `Bearer ${savedToken}`;
      }
    } catch {
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("imobisys_user", JSON.stringify(userData));
    localStorage.setItem("imobisys_token", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("imobisys_user");
    localStorage.removeItem("imobisys_token");
    delete api.defaults.headers.Authorization;
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => !!user && roles.includes(user.role),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
      hasRole,
      loading,
    }),
    [user, login, logout, hasRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Hook profissional
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
};

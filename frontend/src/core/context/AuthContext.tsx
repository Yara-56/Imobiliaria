import { createContext, useState, ReactNode, FC, useEffect } from "react";

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
  loading: boolean; // ✅ 1. Adicionado ao contrato do TypeScript
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ✅ 2. Estado de carregamento inicial

  // ✅ 3. useEffect para ler o localStorage assim que o app abrir
  useEffect(() => {
    const saved = localStorage.getItem("imobisys_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false); // Finaliza o carregamento
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

  const isAuthenticated = !!user;
  const hasRole = (roles: UserRole[]) => (user ? roles.includes(user.role) : false);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
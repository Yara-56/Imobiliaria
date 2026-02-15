import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenant_id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: AuthUser, userToken: string) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("auth_token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};

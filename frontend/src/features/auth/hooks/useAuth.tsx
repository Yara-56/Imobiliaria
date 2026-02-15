// useAuth.tsx
import { createContext, useContext, useState, ReactNode, FC } from "react";

export type UserRole = "ADMIN" | "OWNER" | "USER";

export interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);
  const isAuthenticated = !!user;
  const hasRole = (roles: UserRole[]) => user ? roles.includes(user.role) : false;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default useAuth;
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginRequest } from "@/services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "OWNER";
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("@ImobiSys:user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const data = await loginRequest({ email, pass });
      setUser(data.user);
      localStorage.setItem("@ImobiSys:user", JSON.stringify(data.user));
      localStorage.setItem("@ImobiSys:token", data.token);
      
      toast.success(`Acesso autorizado! Bem-vinda, ${data.user.name}`);
      navigate("/admin/dashboard");
    } catch (error: any) {
      // Captura de erro profissional: verifica se o servidor respondeu ou se caiu
      const errorMessage = error.response?.data?.message || "Servidor offline ou erro de conexão.";
      
      console.error("Erro capturado no Contexto:", errorMessage);
      toast.error("Erro de Autenticação", {
        description: errorMessage,
      });

      throw error; // Lança para o componente parar o loading
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
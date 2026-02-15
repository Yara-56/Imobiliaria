// src/app/providers.jsx
import { AuthProvider } from "../core/auth/contexts/AuthContext";
// import { ThemeProvider } from "../contexts/ThemeContext"; // Exemplo futuro

export default function Providers({ children }) {
  return (
    // 1. Primeiro a Autenticação (Fundamental para o SaaS)
    <AuthProvider>
      {/* 2. Outros provedores como Temas ou React Query viriam aqui */}
      {children}
    </AuthProvider>
  );
}
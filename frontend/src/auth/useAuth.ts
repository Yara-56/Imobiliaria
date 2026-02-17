import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx"; // ✅ Use extensões .tsx

/**
 * 🛡️ Hook profissional para acessar o estado global de autenticação.
 * Garante que o usuário logado e as permissões de Tenant estejam disponíveis.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("❌ useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};

export default useAuth;

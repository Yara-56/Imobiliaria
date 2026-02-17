import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/auth/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "OWNER" | "USER")[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  /**
   * ⏳ TRATAMENTO DE CARREGAMENTO
   * Substituímos 'thickness' por 'borderWidth' e 'spacing' por 'gap'
   * para total compatibilidade com Chakra UI v3.
   */
  if (loading) {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Spinner 
            size="xl" 
            color="blue.500" 
            borderWidth="4px" // ✅ CORREÇÃO: thickness -> borderWidth
          />
          <Text color="gray.500" fontWeight="medium">
            Verificando segurança...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 🛡️ 1. Proteção de Autenticação
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 2. Proteção de Cargo (Role)
  if (allowedRoles && !allowedRoles.includes(user?.role as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ 3. Renderização das Rotas Filhas
  return <Outlet />;
}
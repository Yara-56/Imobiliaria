"use client"

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext"; // ✅ Caminho sincronizado com seu projeto

interface ProtectedRouteProps {
  allowedRoles?: ("ADMIN" | "OWNER" | "USER")[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth(); //
  const location = useLocation();

  /**
   * ⏳ TRATAMENTO DE CARREGAMENTO (Dark Mode Experience)
   */
  if (loading) {
    return (
      <Center h="100vh" w="100vw" bg="#020617">
        <VStack gap={4}>
          <Spinner 
            size="xl" 
            color="blue.500" 
            borderWidth="4px" // ✅ Padrão Chakra v3
          />
          <Text color="slate.500" fontWeight="bold" letterSpacing="widest">
            VALIDANDO SEGURANÇA...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 🛡️ 1. Proteção de Autenticação: Redireciona para login salvando a rota original
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔑 2. Proteção de Cargo: Se não tiver a role necessária, volta para o dashboard seguro
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ 3. Autorizado: Renderiza as rotas internas via Outlet
  return <Outlet />;
}
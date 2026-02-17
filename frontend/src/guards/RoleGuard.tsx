"use client"

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; //
import type { UserRole } from "@/context/AuthContext"; //
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";

interface RoleGuardProps {
  roles: UserRole[];
}

export default function RoleGuard({ roles }: RoleGuardProps) {
  const { user, isAuthenticated, loading } = useAuth(); //

  // ✅ 1. Enquanto o AuthContext recupera o token do localStorage
  if (loading) {
    return (
      <Center h="100vh" w="100vw" bg="#020617">
        <VStack gap={4}>
          <Spinner color="blue.500" size="xl" borderWidth="4px" />
          <Text color="slate.500" fontWeight="bold" letterSpacing="widest">
            VERIFICANDO PERMISSÕES...
          </Text>
        </VStack>
      </Center>
    );
  }

  // ✅ 2. Se não estiver autenticado, volta para o Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ 3. Se o cargo do usuário não estiver na lista permitida
  // Sugestão: Redirecionar para a Dashboard em vez de uma página 403 inexistente
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ 4. Autorizado: Libera as rotas filhas (Outlet)
  return <Outlet />;
}
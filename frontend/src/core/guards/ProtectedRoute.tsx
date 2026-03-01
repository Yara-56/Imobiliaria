"use client";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

// ✅ Usando o Alias configurado no TS 7.0 (Sem erro de localização)
import { useAuth } from "@/context/AuthContext"; 

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "owner" | "user")[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh" w="100vw" bg="#020617">
        <VStack spaceY={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="gray.500" fontWeight="bold" fontSize="xs" letterSpacing="widest">
            VALIDANDO SEGURANÇA...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificação de Roles baseada no seu TenantSchema
  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
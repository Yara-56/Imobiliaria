import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Center, Spinner, VStack, Text } from "@chakra-ui/react";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh" w="100vw" bg="#020617">
        <VStack gap="4">
          <Spinner 
            color="blue.500" 
            size="xl" 
            // ✅ No v3, usamos borderWidth em vez de thickness
            borderWidth="4px" 
            // ✅ A animação agora é controlada via CSS ou deixada no padrão
          />
          <Text color="slate.500" fontWeight="bold" letterSpacing="widest">
            VALIDANDO ACESSO...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
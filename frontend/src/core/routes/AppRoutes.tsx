import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, ReactNode } from "react";
import { Center, Spinner, Text, Button, VStack } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";

// Layouts e Guards
import { AdminLayout } from "../../features/admin/layouts/AdminLayout";

// Páginas de Carregamento Rápido
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/marketing/pages/HomePage";

// Páginas em Lazy Loading
const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const PropertiesPage = lazy(() => import("../../features/properties/pages/PropertiesPage"));
const ContractsPage = lazy(() => import("../../features/contracts/pages/ContractsPage"));

/** * 🛡️ Guard de Rota Profissional 
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/** * 🏗️ Fallback de Erro (Caso o download da página falhe)
 */
const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <Center h="100vh" bg="gray.950" p={6}>
    <VStack gap={4} textAlign="center">
      <Text color="red.400" fontWeight="bold">Erro ao carregar a página.</Text>
      <Text color="gray.500" fontSize="sm">{error.message}</Text>
      <Button colorPalette="blue" onClick={resetErrorBoundary} borderRadius="xl">
        Tentar novamente
      </Button>
    </VStack>
  </Center>
);

/**
 * ⏳ Loader de Transição (Chakra v3)
 */
const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="gray.950" position="fixed" zIndex={9999}>
    <VStack gap={4}>
      <Spinner size="xl" color="blue.500" borderWidth="4px" />
      <Text color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
        Carregando...
      </Text>
    </VStack>
  </Center>
);

export default function AppRoutes() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* CAMADA PÚBLICA */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* CAMADA PRIVADA */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="contracts" element={<ContractsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
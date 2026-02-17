import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, ReactNode } from "react";
import { Center, Spinner, Text, Button, VStack } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "@/core/hooks/auth/useAuth.ts";

// Layouts e Guards
import { AdminLayout } from "../../features/admin/layouts/AdminLayout";

// Páginas de Carregamento Rápido
import LoginPage from "../../features/auth/pages/LoginPage";
import HomePage from "../../features/marketing/pages/HomePage";

// ✅ CORREÇÃO: Nome ajustado para 'PaymentPage' (singular) conforme seu arquivo físico
const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage.tsx"));
const PropertiesPage = lazy(() => import("../../features/properties/pages/PropertiesPage.tsx"));
const TenantsPage = lazy(() => import("../../features/tenants/pages/TenantsPage.tsx"));
const ContractsPage = lazy(() => import("../../features/contracts/pages/ContractsPage.tsx"));
const PaymentPage = lazy(() => import("../../features/payments/pages/PaymentPage.tsx"));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return <>{children}</>;
};

const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="gray.950" position="fixed" zIndex={9999}>
    <VStack gap={4}>
      <Spinner size="xl" color="blue.500" borderWidth="4px" />
      <Text color="gray.500" fontSize="xs" fontWeight="bold" letterSpacing="widest">Carregando AuraImobi...</Text>
    </VStack>
  </Center>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="payments" element={<PaymentPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
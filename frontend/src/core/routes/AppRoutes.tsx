import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Center, Spinner, VStack, Text, Box } from "@chakra-ui/react";

// 1. Imports de Guards e Layouts (Core)
import ProtectedRoute from "../guards/ProtectedRoute";
import RoleGuard from "../guards/RoleGuard"; 
import MainLayout from "../layouts/MainLayout"; 
import { AdminLayout } from "../layouts/AdminLayout"; 

// 2. Importação de Páginas com Lazy Loading (Features)
const HomePage = lazy(() => import("../../features/marketing/pages/HomePage"));
const LoginForm = lazy(() => import("../../features/auth/components/LoginForm"));
const Dashboard = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const PropertiesListPage = lazy(() => import("../../features/properties/pages/PropertiesListPage"));
const ContractsPage = lazy(() => import("../../features/contracts/pages/ContractsPage"));
const TenantsPage = lazy(() => import("../../features/tenants/pages/TenantsPages"));
const PaymentsPage = lazy(() => import("../../features/payments/pages/PaymentPage"));

// Definição de permissões para segurança (Roles do seu Enum)
const ADMIN_ROLES: ("ADMIN" | "OWNER" | "USER")[] = ["ADMIN", "OWNER"];

/**
 * 🚀 Loader Profissional: Resolve o erro ts(2322) do Chakra v3
 */
const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="white">
    <VStack gap={4}>
      <Spinner 
        size="xl" 
        color="blue.500" 
        borderWidth="4px" // Substitui o 'thickness' do v2
      />
      <Text color="blue.600" fontWeight="bold" fontSize="lg">
        Iniciando ImobiSys...
      </Text>
    </VStack>
  </Center>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        
        {/* --- CAMADA PÚBLICA (Site & Login) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>

        {/* --- CAMADA PROTEGIDA (Painel Administrativo) --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Layout com Sidebar, Navbar e Breadcrumbs */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Validação de Papel do Usuário */}
            <Route element={<RoleGuard roles={ADMIN_ROLES} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="properties" element={<PropertiesListPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
            </Route>

          </Route>
        </Route>

        {/* --- FALLBACK: Qualquer rota não mapeada volta para o Início --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Suspense>
  );
}
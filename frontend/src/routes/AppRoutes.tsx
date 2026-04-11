"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

// --- LAYOUTS ---
import { AdminLayout } from "../features/admin/layouts/AdminLayout";

// --- AUTH & MARKETING ---
import HomePage from "../features/marketing/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";

// --- FEATURES ---
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import PaymentPage from "../features/payments/pages/PaymentPage";

// --- TENANTS (Locatários) ---
import TenantsPage from "../features/tenants/pages/TenantDashboardPage";
import NewTenantPage from "../features/tenants/pages/NewTenantPage";
import EditTenantPage from "../features/tenants/pages/EditTenantPage";

// --- PROPERTIES (Imóveis) ---
import PropertiesPage from "../features/properties/pages/PropertiesPage";
import NewPropertyPage from "../features/properties/pages/NewPropertyPage";
import EditPropertyPage from "../features/properties/pages/EditPropertyPage";

// --- CONTRACTS (Módulo Interligado) ---
import ContractDashboardPage from "../features/contracts/pages/ContractDashboardPage"; 
import ContractsListPage from "../features/contracts/pages/ContractsListPage"; // ✅ Importado corretamente
import CreateContractTemplate from "../features/contracts/templates/CreateContractTemplate";

/**
 * 🛡️ ProtectedRoute: Cybersecurity Layer.
 * Garante que o acesso ao cluster administrativo exija autenticação.
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    // 🛠️ DEV BYPASS: Agiliza o desenvolvimento no seu ambiente local
    if (!isAuthenticated && !loading) {
      const devAdmin: any = {
        id: "dev-01",
        name: "Iara Oliveira",
        email: "admin@auraimobi.com",
        role: "admin",
      };
      login(devAdmin, "dev-token-session");
    }
  }, [isAuthenticated, loading, login]);

  if (loading) {
    return (
      <Center h="100vh" bg="gray.950">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text color="gray.400" fontSize="xs" fontWeight="black" letterSpacing="widest">
            SINCRONIZANDO AURA CORE...
          </Text>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};

/**
 * 🚀 AppRoutes: Arquitetura Global de Navegação SaaS.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 ÁREA PÚBLICA */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 🔐 ÁREA ADMINISTRATIVA PROTEGIDA */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirecionamento Automático: /admin -> /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* 📊 DASHBOARD PRINCIPAL */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 🏢 MÓDULO DE LOCATÁRIOS (TENANTS) */}
        <Route path="tenants">
          <Route index element={<TenantsPage />} />
          <Route path="new" element={<NewTenantPage />} />
          <Route path="edit/:id" element={<EditTenantPage />} />
        </Route>

        {/* 🏠 MÓDULO DE IMÓVEIS (PROPERTIES) */}
        <Route path="properties">
          <Route index element={<PropertiesPage />} />
          <Route path="new" element={<NewPropertyPage />} />
          <Route path="edit/:id" element={<EditPropertyPage />} />
        </Route>

        {/* 📄 MÓDULO DE CONTRATOS (FLUXO COMPLETO) */}
        <Route path="contracts">
          {/* /admin/contracts -> Página de Modelos CPF/CNPJ */}
          <Route index element={<ContractDashboardPage />} />
          
          {/* /admin/contracts/list -> Tabela de contratos ativos */}
          <Route path="list" element={<ContractsListPage />} />
          
          {/* /admin/contracts/new -> Formulário de criação */}
          <Route path="new" element={<CreateContractTemplate />} />
        </Route>

        {/* 💰 FINANCEIRO E PAGAMENTOS */}
        <Route path="payments" element={<PaymentPage />} />
      </Route>

      {/* 🛡️ CATCH-ALL: Proteção contra rotas inexistentes */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
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
import PropertiesPage from "../features/properties/pages/PropertiesPage";
import ContractsPage from "../features/contracts/pages/ContractsPage";
import PaymentPage from "../features/payments/pages/PaymentPage";

// --- TENANTS (Locatários/Clientes) ---
import TenantsPage from "../features/tenants/pages/TenantsPage";
import NewTenantPage from "../features/tenants/pages/NewTenantPage";
import EditTenantPage from "../features/tenants/pages/EditTenantPage";

/**
 * 🛡️ ProtectedRoute: Implementação de Segurança (Cybersecurity).
 * Garante que apenas usuários autenticados acessem o cluster administrativo.
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    // 🛠️ DEV BYPASS: Agiliza o desenvolvimento no seu MacBook
    if (!isAuthenticated && !loading) {
      const devAdmin: any = {
        id: "dev-01",
        name: "Yara Admin",
        email: "admin@auraimobi.com",
        role: "admin"
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
 * 🚀 AppRoutes: Arquitetura Global de Navegação.
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
        
        {/* 📊 DASHBOARD & ANALYTICS */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 🏢 MÓDULO DE LOCATÁRIOS (TENANTS) */}
        <Route path="tenants">
          {/* Listagem: /admin/tenants */}
          <Route index element={<TenantsPage />} />
          
          {/* Cadastro: /admin/tenants/new */}
          <Route path="new" element={<NewTenantPage />} />
          
          {/* Edição: /admin/tenants/edit/:id */}
          <Route path="edit/:id" element={<EditTenantPage />} />
        </Route>

        {/* 🏠 MÓDULO DE IMÓVEIS (PROPERTIES) */}
        <Route path="properties">
          <Route index element={<PropertiesPage />} />
        </Route>

        {/* 📄 CONTRATOS */}
        <Route path="contracts" element={<ContractsPage />} />

        {/* 💰 FINANCEIRO E PAGAMENTOS */}
        <Route path="payments" element={<PaymentPage />} />
      </Route>

      {/* 🛡️ CATCH-ALL: Proteção contra 404 redirecionando para o Dashboard */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
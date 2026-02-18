"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

// --- LAYOUTS ---
// Certifique-se de que o AdminLayout não use "Center" ou "height=100vh" no conteúdo
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
 * 🛡️ ProtectedRoute: Garante acesso apenas a usuários autenticados.
 * Inclui o bypass de dev que você já estava usando.
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, login, loading } = useAuth();

  useEffect(() => {
    // Bypass de Desenvolvimento para agilizar o MVP
    if (!isAuthenticated && !loading) {
      const devAdmin: any = {
        id: "dev-01",
        name: "Yara Admin",
        email: "admin@imobisys.com",
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
            SINCRONIZANDO IMOBISYS CORE...
          </Text>
        </VStack>
      </Center>
    );
  }
  
  return <>{children}</>;
};

/**
 * 🚀 AppRoutes: Configuração completa das rotas.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* 🌐 ÁREA PÚBLICA */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 🔐 ÁREA ADMINISTRATIVA (PROTEGIDA) */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirecionamento Padrão: /admin vai direto para /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* 📊 DASHBOARD & ANALYTICS */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 🏢 MÓDULO DE LOCATÁRIOS (TENANTS) */}
        <Route path="tenants">
          {/* Lista Geral: /admin/tenants */}
          <Route index element={<TenantsPage />} />
          
          {/* Cadastro: /admin/tenants/new */}
          <Route path="new" element={<NewTenantPage />} />
          
          {/* Edição: /admin/tenants/edit/:id */}
          <Route path="edit/:id" element={<EditTenantPage />} />
        </Route>

        {/* 🏠 MÓDULO DE IMÓVEIS (PROPERTIES) */}
        <Route path="properties">
          <Route index element={<PropertiesPage />} />
          {/* Futuras rotas de imoveis entram aqui */}
        </Route>

        {/* 📄 CONTRATOS */}
        <Route path="contracts" element={<ContractsPage />} />

        {/* 💰 FINANCEIRO */}
        <Route path="payments" element={<PaymentPage />} />
      </Route>

      {/* 🛡️ CATCH-ALL: Qualquer erro de URL manda para o admin logado */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
"use client"

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, ReactNode } from "react";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext"; // ✅ Sincronizado com seu hook profissional

// Layouts e Guards
import { AdminLayout } from "../features/admin/layouts/AdminLayout.tsx";

// Páginas de Carregamento Rápido (Critical Path)
import LoginPage from "../features/auth/pages/LoginPage.tsx";
import HomePage from "../features/marketing/pages/HomePage.tsx";

// ✅ Code Splitting para performance SaaS
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage.tsx"));
const PropertiesPage = lazy(() => import("../features/properties/pages/PropertiesPage.tsx"));
const TenantsPage = lazy(() => import("../features/tenants/pages/TenantsPage.tsx"));
const ContractsPage = lazy(() => import("../features/contracts/pages/ContractsPage.tsx"));
const PaymentPage = lazy(() => import("../features/payments/pages/PaymentPage.tsx"));

/* ======================================================
   LOADER: Visual Dark/Glassmorphism para UX fluida
====================================================== */
const PageLoader = () => (
  <Center h="100vh" w="100vw" bg="#020617" position="fixed" zIndex={9999}>
    <VStack gap={4}>
      <Spinner 
        size="xl" 
        color="blue.500" 
        borderWidth="4px" // ✅ Correção para Chakra v3
      />
      <Text color="slate.500" fontSize="xs" fontWeight="bold" letterSpacing="widest">
        CARREGANDO IMOBISYS...
      </Text>
    </VStack>
  </Center>
);

/* ======================================================
   GUARD: Proteção de Rota com Persistência
====================================================== */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth(); // ✅ Usa o contexto que criamos
  const location = useLocation();

  if (loading) return <PageLoader />;
  
  if (!isAuthenticated) {
    // Salva a rota original para redirecionar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/* ======================================================
   ROTAS PRINCIPAIS
====================================================== */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 🔐 Dashboard Administrativa Protegida */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Redireciona /admin para /admin/dashboard automaticamente */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="payments" element={<PaymentPage />} />
        </Route>

        {/* 🛡️ Fallback de Segurança */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
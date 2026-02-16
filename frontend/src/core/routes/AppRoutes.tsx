import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. Imports de Guards e Layouts
import ProtectedRoute from "../guards/ProtectedRoute";
import RoleGuard from "../guards/RoleGuard"; 
// ✅ Se MainLayout também não tiver export default, coloque entre chaves { MainLayout }
import MainLayout from "../layouts/MainLayout"; 
import { AdminLayout } from "../layouts/AdminLayout"; // ✅ CORRIGIDO: Agora com chaves

// 2. Importação de Páginas com Lazy Loading
// Certifique-se que esses arquivos possuem "export default" neles!
const HomePage = lazy(() => import("../../features/home/pages/HomePage"));
const LoginForm = lazy(() => import("../../features/auth/components/LoginForm"));
const Dashboard = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const PropertiesListPage = lazy(() => import("../../features/properties/pages/PropertiesListPage"));
const ContractsPage = lazy(() => import("../../features/contracts/pages/ContractsPage"));
const TenantsPage = lazy(() => import("../../features/tenants/pages/TenantsPages"));
const PaymentsPage = lazy(() => import("../../features/payments/pages/PaymentPage"));

const ADMIN_ROLES = ["ADMIN", "OWNER"];

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: "#2563eb", fontWeight: "bold" }}>Carregando ImobiSys...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<RoleGuard roles={ADMIN_ROLES} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="properties" element={<PropertiesListPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="tenants" element={<TenantsPage />} />
              <Route path="payments" element={<PaymentsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
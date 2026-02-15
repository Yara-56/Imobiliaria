import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// 1. Imports de Guards e Layouts
import ProtectedRoute from "../guards/ProtectedRoute";
import RoleGuard from "../guards/RoleGuard"; 
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// 2. Importação de Páginas (PASTA AGORA EM MINÚSCULO)
const HomePage = lazy(() => import("../../features/home/pages/HomePage"));
const LoginForm = lazy(() => import("../../features/auth/components/LoginForm"));
const Dashboard = lazy(() => import("../../features/dashboard/pages/DashboardPage"));

// ✅ Definição de Roles
const ADMIN_ROLES = ["ADMIN", "OWNER"];

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ padding: "20px" }}>Carregando...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<RoleGuard roles={ADMIN_ROLES} />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
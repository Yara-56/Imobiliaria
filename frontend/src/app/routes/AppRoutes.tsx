import React, { Suspense, FC } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../../core/guards/ProtectedRoute";
import MainLayout from "../../layouts/MainLayout";

// Carregamento preguiçoso para otimizar o sistema
const LoginPage = React.lazy(() => import("../../pages/auth/LoginPage"));
const Dashboard = React.lazy(() => import("../../pages/admin/dashboard/Dashboard"));
const Unauthorized = React.lazy(() => import("../../pages/public/Unauthorized"));

const Loading: FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <span className="text-blue-500 animate-pulse font-bold">Iniciando ImobiSys...</span>
  </div>
);

const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Camada de Segurança Administrativa */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "OWNER"]} />}>
          {/* O MainLayout envolve todas as rotas filhas logadas */}
          <Route element={<MainLayout><Outlet /></MainLayout>}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* Adicione futuras rotas administrativas aqui */}
          </Route>
        </Route>

        {/* Fallback de Segurança: Redireciona para Dashboard ou Login */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
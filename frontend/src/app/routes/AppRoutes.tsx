// src/app/routes/AppRoutes.tsx
import React, { Suspense, FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/core/guards/ProtectedRoute";

// Lazy loading - Removendo qualquer ambiguidade
const HomePage = React.lazy(() => import("@/pages/public/home/HomePage"));
const LoginPage = React.lazy(() => import("@/pages/public/LoginPage"));
const Unauthorized = React.lazy(() => import("@/pages/public/Unauthorized"));

// Tente usar o caminho relativo direto se o @/ ainda der erro
const Dashboard = React.lazy(() => import("../../features/dashboard/pages/Dashboard"));

const Loading: FC = () => (
  <div className="flex items-center justify-center min-h-screen text-indigo-500">
    <span className="animate-pulse text-2xl font-bold text-center">
      Carregando sistema...
    </span>
  </div>
);

// Mudei para export default para casar com seu App.tsx
const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<div>Perfil</div>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "OWNER"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
// src/app/routes/index.tsx
import React, { Suspense, FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/core/guards/ProtectedRoute";

// Lazy loading - Removendo qualquer ambiguidade de extensão .js
const HomePage = React.lazy(() => import("@/pages/public/home/HomePage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const Unauthorized = React.lazy(() => import("@/pages/Unauthorized"));

// Importando o Dashboard que renomeamos para .tsx
const Dashboard = React.lazy(() => import("@/features/dashboard/pages/Dashboard"));

// Componente de carregamento para o Suspense
const Loading: FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-500">
    <span className="animate-pulse text-2xl font-bold">Carregando sistema...</span>
  </div>
);

const AppRoutes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Rotas Públicas do sistema da imobiliária */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rotas Protegidas (Exige estar logado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<div>Perfil do Usuário</div>} />
        </Route>

        {/* Rotas de Administração (Apenas ADMIN e OWNER) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "OWNER"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* Redirecionamento padrão para rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

// Exportando como default para que o App.tsx e o main.tsx funcionem sem chaves { }
export default AppRoutes;
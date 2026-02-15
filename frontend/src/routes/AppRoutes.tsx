import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout"; 

// Ajuste os caminhos conforme sua nova estrutura limpa
const LandingPage = lazy(() => import("@/pages/public/LandingPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage")); // Mova o login para cá
const Dashboard = lazy(() => import("@/pages/admin/dashboard/DashboardPage"));

const AppRoutes = () => (
  <Suspense fallback={<div>Carregando...</div>}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rota Privada */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
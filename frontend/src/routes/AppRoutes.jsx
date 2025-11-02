// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // Removido pois 'user' não é usado

// --- LAYOUT ADMINISTRATIVO ---
import AdminLayout from "../components/layout/AdminLayout";

// --- PÁGINAS PÚBLICAS ---
import HomePage from "../pages/public/HomePage";

// --- PÁGINAS DE ADMIN (PAINEL) ---
import Register from "../pages/admin/Register";
import ForgotPassword from "../pages/admin/ForgotPassword";
import ResetPassword from "../pages/admin/ResetPassword";

// Páginas principais do Admin (dentro do layout)
import Home from "../pages/admin/Home";
import PropertiesList from "../pages/admin/PropertiesList";
import PropertyForm from "../pages/admin/PropertyForm";
import PropertyEdit from "../pages/admin/PropertyEdit";
import PropertyDetails from "../pages/admin/PropertyDetails";

import Tenants from "../pages/admin/Tenants";
import NewTenant from "../pages/admin/NewTenant";
import TenantView from "../pages/admin/TenantView";

import Contracts from "../pages/admin/Contracts";
import ContractForm from "../pages/admin/ContractForm";
import NewContract from "../pages/admin/NewContract";

import ContractTemplateList from "../pages/admin/ContractTemplateList";
import CreateContractTemplate from "../pages/admin/CreateContractTemplate";
import EditContractTemplate from "../pages/admin/EditContractTemplate";

import PaymentHistory from "../pages/admin/PaymentHistory";
import ReceiptView from "../pages/admin/ReceiptView";

// =====================================================
// 🔓 ROTA PROTEGIDA (AGORA SEM LOGIN)
// =====================================================
const ProtectedRoute = ({ children }) => {
  // Tudo liberado — o login foi completamente desativado
  return children;
};

// =====================================================
// 🔗 ROTAS PRINCIPAIS
// =====================================================
export default function AppRoutes() {
  // const { user } = useAuth(); // Não é mais usado aqui

  return (
    <Routes>
      {/* =============================== */}
      {/* ====== ROTAS PÚBLICAS/INICIAL ========= */}
      {/* =============================== */}
      {/* 🛑 MUDANÇA PRINCIPAL: Redireciona a rota raiz para a tela de Inquilinos */}
      <Route path="/" element={<Navigate to="/admin/inquilinos" replace />} />
      {/* Se quiser manter a HomePage para testes, use uma rota diferente: */}
      <Route path="/public" element={<HomePage />} /> 

      {/* =============================== */}
      {/* ====== ROTAS DE ADMIN ========= */}
      {/* =============================== */}

      {/* 🚫 Login desativado — redireciona direto */}
      <Route path="/admin/login" element={<Navigate to="/admin/inquilinos" replace />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/admin/resetar-senha/:token" element={<ResetPassword />} />

      {/* --- Layout liberado --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* ROTAS FILHAS */}
        {/* 🛑 MUDANÇA: O index ( /admin ) agora redireciona para Inquilinos */}
        <Route index element={<Navigate to="/admin/inquilinos" replace />} />
        <Route path="dashboard" element={<Home />} />

        {/* Imóveis */}
        <Route path="imoveis" element={<PropertiesList />} />
        <Route path="imoveis/novo" element={<PropertyForm />} />
        <Route path="imoveis/editar/:id" element={<PropertyEdit />} />
        <Route path="imoveis/:id" element={<PropertyDetails />} />

        {/* Inquilinos */}
        <Route path="inquilinos" element={<Tenants />} />
        <Route path="inquilinos/novo" element={<NewTenant />} />
        <Route path="inquilinos/ver/:id" element={<TenantView />} />
        <Route path="inquilinos/editar/:id" element={<NewTenant />} />

        {/* Contratos */}
        <Route path="contratos" element={<Contracts />} />
        <Route path="contratos/novo" element={<NewContract />} />
        <Route path="contratos/editar/:id" element={<ContractForm />} />

        {/* Modelos de Contrato */}
        <Route path="contratos/modelos" element={<ContractTemplateList />} />
        <Route path="contratos/modelos/novo" element={<CreateContractTemplate />} />
        <Route path="contratos/modelos/editar/:id" element={<EditContractTemplate />} />

        {/* Pagamentos e Recibos */}
        <Route path="pagamentos/historico/:id" element={<PaymentHistory />} />
        <Route path="recibo/:id" element={<ReceiptView />} />
      </Route>

      {/* =============================== */}
      {/* ====== REDIRECIONAMENTOS ====== */}
      {/* =============================== */}
      {/* O '/home' agora aponta para inquilinos */}
      <Route path="/home" element={<Navigate to="/admin/inquilinos" replace />} />

      {/* =============================== */}
      {/* ====== ROTA INEXISTENTE ======= */}
      {/* =============================== */}
      {/* O '*' agora redireciona para a tela de Inquilinos, e não mais para '/' */}
      <Route path="*" element={<Navigate to="/admin/inquilinos" replace />} />
    </Routes>
  );
}
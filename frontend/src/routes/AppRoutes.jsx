import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- LAYOUT ADMINISTRATIVO ---
import AdminLayout from "../components/layout/AdminLayout";

// --- PÁGINAS PÚBLICAS ---
import HomePage from "../pages/public/HomePage";

// --- PÁGINAS DE ADMIN (PAINEL) ---
import Login from "../pages/admin/Login";
import Register from "../pages/admin/Register";
import ForgotPassword from "../pages/admin/ForgotPassword";
import ResetPassword from "../pages/admin/ResetPassword";

// --- PÁGINAS PRINCIPAIS DO ADMIN (DENTRO DO LAYOUT) ---
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

// --- PROTECTED ROUTE CORRIGIDO ---
import ProtectedRoute from "../components/ProtectedRoute";

// =====================================================
// 🔗 ROTAS PRINCIPAIS
// =====================================================
export default function AppRoutes() {
  return (
    <Routes>
      {/* =============================== */}
      {/* ====== ROTAS PÚBLICAS ========= */}
      {/* =============================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/public" element={<HomePage />} />

      {/* Redireciona /login para o path admin */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/admin/resetar-senha/:token" element={<ResetPassword />} />

      {/* =============================== */}
      {/* ====== ROTAS ADMIN ============ */}
      {/* =============================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Rotas filhas */}
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
      {/* Qualquer rota desconhecida vai para HomePage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

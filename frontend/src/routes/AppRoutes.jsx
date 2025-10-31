// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// --- LAYOUT ADMINISTRATIVO ---
import AdminLayout from "../components/layout/AdminLayout";

// --- PÁGINAS PÚBLICAS ---
import HomePage from "../pages/public/HomePage";
// (Você pode adicionar mais páginas públicas futuramente)
// import PropertiesPage from "../pages/public/PropertiesPage";
// import PropertyDetailsPage from "../pages/public/PropertyDetailsPage";
// import ContactPage from "../pages/public/ContactPage";

// --- PÁGINAS DE ADMIN (PAINEL) ---
// Autenticação
import Login from "../pages/admin/Login";
import Register from "../pages/admin/Register";
import ForgotPassword from "../pages/admin/ForgotPassword";
import ResetPassword from "../pages/admin/ResetPassword";

// Páginas principais do Admin (dentro do layout)
import Home from "../pages/admin/Home";
import PropertiesList from "../pages/admin/PropertiesList";
import PropertyForm from "../pages/admin/PropertyForm";
import PropertyEdit from "../pages/admin/PropertyEdit";
import Tenants from "../pages/admin/Tenants";
import Contracts from "../pages/admin/Contracts";
import ContractForm from "../pages/admin/ContractForm";
import NewContract from "../pages/admin/NewContract";
import ContractTemplateList from "../pages/admin/ContractTemplateList";
import CreateContractTemplate from "../pages/admin/CreateContractTemplate";
import EditContractTemplate from "../pages/admin/EditContractTemplate";
import PaymentHistory from "../pages/admin/PaymentHistory";
import ReceiptView from "../pages/admin/ReceiptView";

// --- ROTA PROTEGIDA ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center font-inter text-gray-600">
        Carregando autenticação...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children; // Retorna o conteúdo protegido
};

// --- ROTAS PRINCIPAIS ---
export default function AppRoutes() {
  return (
    <Routes>
      {/* =============================== */}
      {/* ====== ROTAS PÚBLICAS ========= */}
      {/* =============================== */}
      <Route path="/" element={<HomePage />} />

      {/* =============================== */}
      {/* ====== ROTAS DE ADMIN ========= */}
      {/* =============================== */}

      {/* --- Rotas de autenticação --- */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/admin/resetar-senha/:token" element={<ResetPassword />} />

      {/* --- Layout protegido --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* ROTAS FILHAS (vão dentro do <Outlet /> no AdminLayout) */}
        <Route path="dashboard" element={<Home />} />

        {/* Imóveis */}
        <Route path="imoveis" element={<PropertiesList />} />
        <Route path="imoveis/novo" element={<PropertyForm />} />
        <Route path="imoveis/editar/:id" element={<PropertyEdit />} />

        {/* Inquilinos */}
        <Route path="inquilinos" element={<Tenants />} />

        {/* Contratos */}
        <Route path="contratos" element={<Contracts />} />
        <Route path="contratos/novo" element={<NewContract />} />
        <Route path="contratos/editar/:id" element={<ContractForm />} />

        {/* Modelos de Contrato */}
        <Route path="contratos/modelos" element={<ContractTemplateList />} />
        <Route
          path="contratos/modelos/novo"
          element={<CreateContractTemplate />}
        />
        <Route
          path="contratos/modelos/editar/:id"
          element={<EditContractTemplate />}
        />

        {/* Pagamentos e Recibos */}
        <Route path="pagamentos/historico/:id" element={<PaymentHistory />} />
        <Route path="recibo/:id" element={<ReceiptView />} />

        {/* Se o usuário digitar apenas /admin, vai para /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* =============================== */}
      {/* ====== REDIRECIONAMENTOS ====== */}
      {/* =============================== */}
      <Route path="/home" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* =============================== */}
      {/* ====== ROTA INEXISTENTE ======= */}
      {/* =============================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

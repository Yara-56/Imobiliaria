import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- NOVO LAYOUT ---
import AdminLayout from '../layouts/AdminLayout'; // <--- 1. IMPORTAR O LAYOUT

// --- PÁGINAS PÚBLICAS ---
import HomePage from '../pages/public/HomePage';
// (No futuro, você vai criar e importar estas)
// import PropertiesPage from '../pages/public/PropertiesPage';
// import PropertyDetailsPage from '../pages/public/PropertyDetailsPage';
// import ContactPage from '../pages/public/ContactPage';


// --- PÁGINAS DE ADMIN (PAINEL) ---
// Autenticação
import Login from '../pages/admin/Login';
import Register from '../pages/admin/Register';
import ForgotPassword from '../pages/admin/ForgotPassword';
import ResetPassword from '../pages/admin/ResetPassword';

// Páginas principais do Admin (que vão dentro do Layout)
import Home from '../pages/admin/Home';
import PropertiesList from '../pages/admin/PropertiesList';
import PropertyForm from '../pages/admin/PropertyForm';
import PropertyEdit from '../pages/admin/PropertyEdit';
import Tenants from '../pages/admin/Tenants';
import Contracts from '../pages/admin/Contracts';
import ContractForm from '../pages/admin/ContractForm';
import NewContract from '../pages/admin/NewContract';
import ContractTemplateList from '../pages/admin/ContractTemplateList';
import CreateContractTemplate from '../pages/admin/CreateContractTemplate';
import EditContractTemplate from '../pages/admin/EditContractTemplate';
import PaymentHistory from '../pages/admin/PaymentHistory';
import ReceiptView from '../pages/admin/ReceiptView';


// --- COMPONENTE DE ROTA PROTEGIDA ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return <div className="w-full h-screen flex items-center justify-center font-inter text-gray-600">Carregando autenticação...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children; // Retorna o <AdminLayout />
};


// --- COMPONENTE PRINCIPAL DE ROTAS ---
export default function AppRoutes() {
  return (
    <Routes>
      
      {/* ======================================== */}
      {/* ===== ROTAS PÚBLICAS (A VITRINE) ===== */}
      {/* ======================================== */}
      <Route path="/" element={<HomePage />} />
      {/* ...outras rotas públicas... */}


      {/* ====================================== */}
      {/* ===== ROTAS DE ADMIN (O PAINEL) ===== */}
      {/* ====================================== */}
      
      {/* --- Rotas de Autenticação (fora do layout) --- */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/admin/resetar-senha/:token" element={<ResetPassword />} />

      {/* --- 2. NOVA ROTA DE LAYOUT PROTEGIDO --- */}
      {/* Esta rota "abraça" todas as outras páginas de admin */}
      <Route 
        path="/admin" // Rota pai para tudo que é de admin
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* 3. ROTAS FILHAS (vão aparecer dentro do <Outlet />) */}
        {/* Repare que o path não tem mais "/admin/" no começo */}
        
        <Route path="dashboard" element={<Home />} />
        
        <Route path="imoveis" element={<PropertiesList />} />
        <Route path="imoveis/novo" element={<PropertyForm />} />
        <Route path="imoveis/editar/:id" element={<PropertyEdit />} />

        <Route path="inquilinos" element={<Tenants />} />
        
        <Route path="contratos" element={<Contracts />} />
        <Route path="contratos/novo" element={<NewContract />} />
        <Route path="contratos/editar/:id" element={<ContractForm />} />
        
        <Route path="contratos/modelos" element={<ContractTemplateList />} />
        <Route path="contratos/modelos/novo" element={<CreateContractTemplate />} />
        <Route path="contratos/modelos/editar/:id" element={<EditContractTemplate />} />
        
        <Route path="pagamentos/historico/:id" element={<PaymentHistory />} />
        <Route path="recibo/:id" element={<ReceiptView />} />
        
        {/* Redirecionamento: Se o usuário digitar só /admin, vai para /admin/dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      

      {/* ============================== */}
      {/* ===== REDIRECIONAMENTOS ===== */}
      {/* ============================== */}
      {/* Se o usuário logado tentar ir para /home, mande-o para /admin/dashboard */}
      <Route path="/home" element={<Navigate to="/admin/dashboard" replace />} />
      {/* Se o usuário tentar acessar /admin (sem nada), também redireciona */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

    </Routes>
  );
}
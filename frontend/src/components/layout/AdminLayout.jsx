import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "../admin/Topbar";
import Menu from "../Menu"; // ✅ Importando o menu antigo

export default function AdminLayout() {
  const location = useLocation();
  
  // 🔹 Define o título e subtítulo da página conforme a rota atual
  const getPageInfo = (path) => {
    if (path.includes("dashboard")) return { title: "Dashboard", subtitle: "Visão Geral" };
    if (path.includes("imoveis/novo")) return { title: "Imóveis", subtitle: "Novo Cadastro" };
    if (path.includes("imoveis")) return { title: "Imóveis", subtitle: "Listagem" };
    if (path.includes("inquilinos")) return { title: "Inquilinos", subtitle: "Gerenciamento" };
    if (path.includes("contratos/novo")) return { title: "Contratos", subtitle: "Novo Contrato" };
    if (path.includes("contratos")) return { title: "Contratos", subtitle: "Listagem" };
    if (path.includes("report")) return { title: "Relatórios", subtitle: "Análises e Dados" };
    if (path.includes("settings")) return { title: "Configurações", subtitle: "Preferências do Sistema" };
    return { title: "Admin", subtitle: "Página Principal" };
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-800">
      {/* ✅ Usa o Menu antigo no lugar do Sidebar */}
      <Menu />

      {/* Conteúdo da área principal */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Topbar title={title} subtitle={subtitle} />
        
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className="flex-1 overflow-y-auto p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Topbar from "../admin/Topbar";
import Sidebar from "../admin/SideBar";

export default function AdminLayout() {
  const location = useLocation();
  
  const getPageInfo = (path) => {
    if (path.includes("dashboard")) return { title: "Dashboard", subtitle: "Visão Geral" };
    if (path.includes("imoveis/novo")) return { title: "Imóveis", subtitle: "Novo Cadastro" };
    if (path.includes("imoveis")) return { title: "Imóveis", subtitle: "Listagem" };
    if (path.includes("contratos/novo")) return { title: "Contratos", subtitle: "Novo Contrato" };
    return { title: "Admin", subtitle: "Página Principal" };
  };

  const { title, subtitle } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-800">
      <Sidebar />
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

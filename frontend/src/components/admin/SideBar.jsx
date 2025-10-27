import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBuilding, FaUsers, FaFileContract, FaCog } from 'react-icons/fa';

export default function Sidebar() {
  
  // Estilo reutilizável para os links
  const linkClass = "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 transition-colors";
  const activeLinkClass = "bg-blue-700 text-white font-semibold shadow-lg";

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-2xl">
      
      {/* 1. Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Imobiliária Lacerda</h2>
      </div>

      {/* 2. Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        
        {/* Usamos NavLink para ele saber qual link está "ativo" */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : 'hover:bg-gray-800'}`}
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/imoveis"
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : 'hover:bg-gray-800'}`}
        >
          <FaBuilding />
          <span>Imóveis</span>
        </NavLink>
        
        <NavLink
          to="/admin/inquilinos"
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : 'hover:bg-gray-800'}`}
        >
          <FaUsers />
          <span>Inquilinos</span>
        </NavLink>

        <NavLink
          to="/admin/contratos"
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : 'hover:bg-gray-800'}`}
        >
          <FaFileContract />
          <span>Contratos</span>
        </NavLink>

        {/* Adicione mais links aqui... */}

      </nav>
      
      {/* 3. Rodapé do Menu (Configurações, etc) */}
      <div className="p-4 border-t border-gray-700">
        <NavLink
          to="/admin/configuracoes" // Você pode criar essa rota depois
          className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : 'hover:bg-gray-800'}`}
        >
          <FaCog />
          <span>Configurações</span>
        </NavLink>
      </div>
    </div>
  );
}
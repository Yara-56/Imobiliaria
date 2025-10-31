import React from 'react';
import { Link } from 'react-router-dom';

// Ícone da logo (SVG)
const IconeLogo = () => (
  <svg
    className="h-8 w-8 text-blue-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M7 21v-6a1 1 0 011-1h2a1 1 0 011 1v6"
    />
  </svg>
);

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo e Nome */}
          <Link to="/" className="flex items-center space-x-2">
            <IconeLogo />
            <span className="text-xl font-bold text-gray-800">
              Imobiliária Lacerda
            </span>
          </Link>
          
          {/* Links de Navegação (Desktop) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Início
            </Link>
            <Link
              to="/admin/imoveis"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Ver Imóveis
            </Link>
            <Link
              to="/contato"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Contato
            </Link>
            <Link
              to="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
            >
              Acesso Restrito
            </Link>
          </div>

          {/* Botão de Menu Mobile (ainda sem lógica) */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-800">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

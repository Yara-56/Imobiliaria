import React from "react";
import { Outlet, Link } from "react-router-dom";

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide">
            ImobiSys
          </Link>

          {/* Menu */}
          <nav className="flex gap-6 text-sm font-medium">
            <Link
              to="/login"
              className="hover:text-indigo-600 transition"
            >
              Entrar
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ImobiSys — Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
// src/pages/public/Unauthorized.tsx
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const Unauthorized: FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="flex flex-col items-center bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <div className="bg-red-600/30 p-5 rounded-2xl mb-4 flex items-center justify-center">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Acesso Negado</h1>
        <p className="text-slate-400 text-center mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;

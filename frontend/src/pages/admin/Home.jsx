import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Pega o usuário logado

export default function Home() {
  const { user } = useAuth(); 

  const name = user ? user.name : "Usuário";
  const email = user ? user.email : "sem@email.com";
  const age = user ? user.idade : "--";

  return (
    // Não tem <main> aqui, pois o Layout já tem!
    <div>
      {/* Boas-vindas (para testar que o login funcionou) */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-lg font-semibold mb-4">Bem-vindo(a), {name}!</h1>
        
        {user && (
          <p className="text-gray-600 text-sm">
            <strong>Email:</strong> {email}
          </p>
        )}
        <p className="text-sm mb-2">
          <strong>Idade:</strong> {age} anos
        </p>
        <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-300 rounded-md">
          <span className="font-semibold">✅ Login efetuado com sucesso.</span>
        </div>
      </div>

      {/* Filtros (agora dentro de um card branco) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Filtros Rápidos</h3>
        <form className="flex flex-wrap gap-3">
          <input
            type="date"
            aria-label="Data"
            className="min-w-[160px] px-4 py-2 border border-gray-300 rounded-md text-sm"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
          <select
            aria-label="Status"
            className="min-w-[160px] px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Status</option>
            <option value="ativo">Ativo</option>
          </select>
          <select
            aria-label="Meio de Pagamento"
            className="min-w-[160px] px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Meio de Pagamento</option>
          </select>
          <select
            aria-label="Imóvel"
            className="min-w-[160px] px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Imóvel</option>
          </select>
          <input
            type="text"
            placeholder="Pesquisar por nome ou imóvel"
            aria-label="Pesquisar"
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </form>
      </div>

    </div>
  );
}
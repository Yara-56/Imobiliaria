import React, { useEffect, useState } from 'react';
import { listContracts } from '../../services/contractService';
import { Link } from 'react-router-dom';

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await listContracts();
      setContracts(data);
    }
    load();
  }, []);

  const filtered = contracts.filter((contract) => {
    const text = `${contract.nome} ${contract.locatario?.name} ${contract.imovel?.descricao}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Gestão de contratos</h2>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e gerencie todos os contratos cadastrados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Nome, CPF, RG, E-mail, cód. imóvel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[240px] px-4 py-2 text-sm border border-gray-300 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="flex gap-3">
            <Link to="/new-contract">
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                Criar novo contrato
              </button>
            </Link>
            <Link to="/contract-templates">
              <button className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                Modelos de contrato
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <table className="w-full border-collapse mt-2">
        <thead>
          <tr>
            <th className="text-left text-sm font-semibold text-gray-500 px-3 py-2 border-b">Nome</th>
            <th className="text-left text-sm font-semibold text-gray-500 px-3 py-2 border-b">Inquilino</th>
            <th className="text-left text-sm font-semibold text-gray-500 px-3 py-2 border-b">Última modificação</th>
            <th className="text-left text-sm font-semibold text-gray-500 px-3 py-2 border-b">Tamanho do arquivo</th>
            <th className="text-left text-sm px-3 py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((contract) => (
            <tr key={contract._id} className="hover:bg-blue-50">
              <td className="px-3 py-3 text-sm text-gray-800 border-b">{contract.nome}</td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b">{contract.locatario?.name}</td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b">
                {new Date(contract.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b">200KB</td>
              <td className="px-3 py-3 text-sm text-gray-800 border-b">
                <Link to={`/contract/${contract._id}`}>
                  <button className="text-gray-500 hover:text-gray-700 text-lg px-2">...</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

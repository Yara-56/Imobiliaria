import React, { useEffect, useMemo, useState } from 'react';
import removeAccents from 'remove-accents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

// Utilitário para busca sem acentos
const normalize = (text) =>
  typeof text === 'string' ? removeAccents(text.toLowerCase().trim()) : '';

export default function SearchBarWithHistory({ tenants = [], onSelect, selectedTenant }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);

  // 1. Efeito para carregar histórico do localStorage na montagem
  useEffect(() => {
    const savedHistory = localStorage.getItem('tenant_search_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erro ao carregar histórico do localStorage", e);
      }
    }
  }, []);

  // 2. Efeito para salvar histórico no localStorage sempre que 'history' mudar
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('tenant_search_history', JSON.stringify(history));
    } else {
      localStorage.removeItem('tenant_search_history');
    }
  }, [history]);

  // 3. Efeito para filtrar inquilinos (CORRIGIDO PARA t.name)
  useEffect(() => {
    const filtered = tenants.filter((t) =>
      // CORREÇÃO: Usando t.name (padrão em inglês). Se sua API usa "nome", troque para t.nome.
      normalize(t.name).includes(normalize(search))
      // normalize(t.nome).includes(normalize(search)) // Versão para API com campo 'nome'
    );
    setSuggestions(search ? filtered : []);
  }, [search, tenants]);

  const handleSelect = (tenant) => {
    setSearch('');
    
    // Atualiza o histórico (mantém os 3 mais recentes)
    if (!history.find((h) => h._id === tenant._id)) { 
      setHistory([tenant, ...history.slice(0, 2)]);
    }
    
    // Notifica o componente pai
    onSelect?.(tenant);
  };

  // Decide qual lista renderizar (Busca ou Histórico)
  const finalList = search ? suggestions : history;
  const isHistoryList = !search && history.length > 0;
  const showUserIcon = !isHistoryList || search;

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={isHistoryList ? "Buscar ou selecionar do histórico..." : "Buscar por nome..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
      </div>

      <ul className="space-y-1 max-h-72 overflow-y-auto">
        {finalList.length === 0 ? (
          <li className="px-4 py-2 text-sm text-gray-400 text-center">
            {search && !isHistoryList ? "Nenhum inquilino encontrado." : "Histórico vazio. Comece a buscar."}
          </li>
        ) : (
          <>
            {isHistoryList && <li className="px-4 py-1 text-xs font-semibold text-gray-500">Histórico Recente</li>}
            {finalList.map((tenant) => (
              <li
                key={tenant._id}
                onClick={() => handleSelect(tenant)}
                className={`rounded-lg px-4 py-3 flex items-center cursor-pointer transition-colors duration-200 border-2 ${
                  tenant._id === selectedTenant?._id 
                    ? 'bg-blue-100 border-blue-500 shadow-sm' 
                    : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}
              >
                <FontAwesomeIcon 
                    icon={isHistoryList ? faClock : faUser} 
                    className={`mr-4 text-lg ${tenant._id === selectedTenant?._id ? 'text-blue-600' : 'text-gray-500'}`}
                />
                
                {/* O nome renderizado também deve ser ajustado para 'name' */}
                <span className="font-medium text-gray-800">{tenant.name}</span> 
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}
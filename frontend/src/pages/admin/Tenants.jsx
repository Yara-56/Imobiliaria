// src/pages/admin/Tenants.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { listTenants, deleteTenant } from "../../services/tenantService"; 

export default function Tenants() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [q, setQ] = useState(""); 

  // 1. Função de busca que aciona a API com o termo de busca (q)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTenants({ q }); 

      // 🔑 CORREÇÃO CRÍTICA: Priorizar o próprio 'data' (que é o array retornado)
      let itemsArray = [];
      if (Array.isArray(data)) {
          itemsArray = data;
      } else if (data?.items && Array.isArray(data.items)) {
          // Caso a API mude para retornar { items: [...] }
          itemsArray = data.items;
      }

      // Se sua função listTenants estiver definida como você me mostrou
      // (export const listTenants = async ({ q = "" } = {}) => { ... return data.items ?? data ?? []; });
      // o 'data' aqui já é o array. O mais seguro é simplesmente confiar que o serviço fez o trabalho:
      setItems(data); 

    } catch (err) {
      console.error("Erro ao carregar inquilinos:", err);
      setError("Erro ao carregar os inquilinos.");
      setItems([]); 
    } finally {
      setLoading(false);
    }
  };

  // 2. useEffect para carregar/recarregar a lista quando o 'q' mudar
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
  
  // 3. Opcional: useMemo para filtro local. Mantenha para consistência
  const filteredTenants = useMemo(() => {
    return items; // Retorna os itens já carregados (filtrados ou não)
  }, [items]);
  
  // O restante da sua lógica (Deletar, Ordenação, Renderização) está correta e não precisa de mudança.
  // ... (handleDelete, sortConfig, sortedTenants, requestSort)
  
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const sortedTenants = useMemo(() => {
    const sorted = [...filteredTenants];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredTenants, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar este inquilino?")) return;
    setDeletingId(id);
    try {
      await deleteTenant(id);
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar inquilino. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Inquilinos</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou e-mail..."
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            className="px-3 py-2 border border-gray-300 rounded-md w-64 focus:ring focus:ring-blue-200"
          />
          <button
            onClick={fetchData} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Buscar
          </button>
          <button
            onClick={() => navigate("/admin/inquilinos/novo")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Novo Inquilino
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">Carregando inquilinos...</p>
        </div>
      ) : sortedTenants.length === 0 ? (
        <p className="text-gray-600">Nenhum inquilino encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {[
                  { label: "Nome", key: "name" },
                  { label: "CPF", key: "cpf" },
                  { label: "Email", key: "email" },
                  { label: "Telefone", key: "phone" },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    scope="col"
                    className="border p-2 text-left cursor-pointer select-none"
                    onClick={() => requestSort(key)}
                  >
                    {label}
                    {sortConfig.key === key ? (
                      sortConfig.direction === "asc" ? (
                        " ▲"
                      ) : (
                        " ▼"
                      )
                    ) : null}
                  </th>
                ))}
                <th scope="col" className="border p-2 text-left">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedTenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="border p-2">{tenant.name || "Sem nome"}</td>
                  <td className="border p-2">{tenant.cpf || "—"}</td>
                  <td className="border p-2">{tenant.email || "—"}</td>
                  <td className="border p-2">{tenant.phone || "—"}</td>
                  <td className="border p-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        navigate(`/admin/inquilinos/ver/${tenant._id}`)
                      }
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/inquilinos/editar/${tenant._id}`)
                      }
                      className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tenant._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      disabled={deletingId === tenant._id}
                    >
                      {deletingId === tenant._id ? "Deletando..." : "Deletar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
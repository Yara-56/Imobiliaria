import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProperties, deleteProperty } from "../../services/propertyService";

export default function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const data = await listProperties({ page, limit: 10, q: search });
      setProperties(data.items || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este imóvel?")) return;
    try {
      await deleteProperty(id);
      fetchData(pagination.page);
    } catch (e) {
      console.error(e);
      alert("Não foi possível excluir o imóvel.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Imóveis</h1>
        <Link
          to="/properties/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Imóvel
        </Link>
      </div>

      {/* Barra de busca */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cidade, CEP, status..."
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Buscar
        </button>
      </form>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">CEP</th>
              <th className="p-3">Rua</th>
              <th className="p-3">Cidade</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Nenhum imóvel encontrado
                </td>
              </tr>
            ) : (
              properties.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.title || "-"}</td>
                  <td className="p-3">{p.cep || "-"}</td>
                  <td className="p-3">{p.street || "-"}</td>
                  <td className="p-3">{p.city || "-"}</td>
                  <td className="p-3">{p.state || "-"}</td>
                  <td className="p-3">{p.status || "-"}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link
                      to={`/properties/${p._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchData(pagination.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-700">
            Página {pagination.page} de {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchData(pagination.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

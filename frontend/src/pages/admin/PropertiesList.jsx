import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listProperties, deleteProperty } from "../../services/propertyService";

export default function PropertiesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Mapa de status em português
  const statusLabel = {
    Available: "Disponível",
    Occupied: "Ocupado",
    "Under Maintenance": "Manutenção",
  };

  // Carrega os imóveis
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await listProperties({ q });

      // ✅ Garantindo que pegamos o array certo
      const itemsArray = Array.isArray(response)
        ? response
        : response?.items ?? response?.data ?? [];

      setItems(itemsArray);
    } catch (err) {
      console.error("Erro ao carregar imóveis:", err);
      setItems([]); // Limpa caso dê erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtragem de busca
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((p) =>
      [
        p.sqls,
        p.cep,
        p.street,
        p.bairro,
        p.city,
        p.state,
        p.status,
        p.number,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle))
    );
  }, [items, q]);

  // Deletar imóvel
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar este imóvel?")) return;
    setDeletingId(id);
    try {
      await deleteProperty(id);
      fetchData(); // atualiza lista
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar o imóvel. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Gerenciar Imóveis</h1>

      {/* Campo de busca */}
      <div className="flex items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por bairro, cidade, CEP, status..."
          className="border rounded px-3 py-2 w-80 max-w-full"
        />
        <button
          type="button"
          onClick={fetchData}
          className="px-3 py-2 border rounded hover:bg-gray-50"
        >
          Buscar
        </button>
      </div>

      {/* Tabela de imóveis */}
      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">SQLS</th>
              <th className="px-4 py-2">CEP</th>
              <th className="px-4 py-2">Rua</th>
              <th className="px-4 py-2">Bairro</th>
              <th className="px-4 py-2">Cidade</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-center" colSpan={8}>
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center" colSpan={8}>
                  Nenhum imóvel encontrado
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="px-4 py-2">{p.sqls || "-"}</td>
                  <td className="px-4 py-2">{p.cep || "-"}</td>
                  <td className="px-4 py-2">{p.street || "-"}</td>
                  <td className="px-4 py-2">{p.bairro || "-"}</td>
                  <td className="px-4 py-2">{p.city || "-"}</td>
                  <td className="px-4 py-2">{p.state || "-"}</td>
                  <td className="px-4 py-2">
                    {statusLabel[p.status] ?? p.status ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/imoveis/${p._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/admin/imoveis/editar/${p._id}`}
                        className="text-yellow-600 hover:underline"
                      >
                        ✎
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="text-red-600 hover:underline"
                      >
                        {deletingId === p._id ? "Deletando..." : "🗑️"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

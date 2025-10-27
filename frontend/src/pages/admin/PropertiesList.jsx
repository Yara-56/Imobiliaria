import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listProperties, deleteProperty } from "../../services/propertyService";

export default function PropertiesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // ✅ Mapa de rótulos PT-BR para status que vem do back (EN)
  const statusLabel = {
    Available: "Disponível",
    Occupied: "Ocupado",
    "Under Maintenance": "Manutenção",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listProperties({ q });
      // backend pode retornar { items, pagination } ou array direto
      setItems(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((p) =>
      [
        p.sqls,
        p.cep,
        p.street,
        p.bairro,   // ✅ garante que entra na busca
        p.city,
        p.state,
        p.status,
        p.number,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle))
    );
  }, [items, q]);

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold mb-4">Gerenciar Imóveis</h1>

      {/* Busca menor */}
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

      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">SQLS</th>
              <th className="px-4 py-2">CEP</th>
              <th className="px-4 py-2">Rua</th>
              <th className="px-4 py-2">Bairro</th> {/* ✅ nova coluna */}
              <th className="px-4 py-2">Cidade</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 w-40">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                {/* ✅ colSpan atualizado para 8 por causa da nova coluna */}
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
                  <td className="px-4 py-2">{p.bairro || "-"}</td> {/* ✅ mostra o bairro */}
                  <td className="px-4 py-2">{p.city || "-"}</td>
                  <td className="px-4 py-2">{p.state || "-"}</td>
                  <td className="px-4 py-2">
                    {/* ✅ traduz status EN -> PT-BR */}
                    {statusLabel[p.status] ?? p.status ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/imoveis/${p._id}/editar`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalhes
                    </Link>
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

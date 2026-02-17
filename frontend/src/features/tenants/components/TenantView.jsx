import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listTenants, deleteTenant } from "../../services/tenantService";

export default function TenantsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listTenants({ q });
      setItems(res?.data ?? res ?? []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return items.filter((t) =>
      [t.name, t.email, t.phone]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(needle))
    );
  }, [items, q]);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este inquilino?")) return;
    await deleteTenant(id);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar inquilino..."
          className="border px-3 py-2 rounded"
        />

        <Link
          to="/admin/inquilinos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Novo Inquilino
        </Link>
      </div>

      <table className="min-w-full bg-white border rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-6">
                Carregando...
              </td>
            </tr>
          ) : filtered.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6">
                Nenhum registro
              </td>
            </tr>
          ) : (
            filtered.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="px-4 py-2">{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td className="flex gap-2">
                  <Link to={`/admin/inquilinos/${t._id}`} className="text-blue-600">
                    Ver
                  </Link>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
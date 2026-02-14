import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listTenants, deleteTenant } from "../../../services/tenantService";

export default function Tenants() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listTenants({ q });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    return items.filter((t) =>
      [t.name, t.email, t.phone]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q.toLowerCase()))
    );
  }, [items, q]);

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

      <table className="w-full bg-white border rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Nome</th>
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
          ) : (
            filtered.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => deleteTenant(t._id).then(fetchData)}
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
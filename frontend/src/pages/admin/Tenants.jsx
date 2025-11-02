// src/pages/admin/Tenants.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listTenants, deleteTenant } from "../../services/tenantService";

export default function Tenants() {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Buscar todos os inquilinos
  useEffect(() => {
    async function fetchTenants() {
      try {
        setLoading(true);
        const data = await listTenants();
        setTenants(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os inquilinos.");
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, []);

  // Deletar inquilino
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar este inquilino?")) return;

    setDeletingId(id);
    try {
      await deleteTenant(id);
      setTenants((prev) => prev.filter((tenant) => tenant._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar inquilino. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p>Carregando inquilinos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inquilinos</h1>
        <button
          onClick={() => navigate("/admin/inquilinos/novo")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Novo Inquilino
        </button>
      </div>

      {tenants.length === 0 ? (
        <p>Nenhum inquilino encontrado.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nome</th>
              <th className="border p-2 text-left">CPF</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Telefone</th>
              <th className="border p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant._id} className="hover:bg-gray-50">
                <td className="border p-2">{tenant.name}</td>
                <td className="border p-2">{tenant.cpf}</td>
                <td className="border p-2">{tenant.email || "—"}</td>
                <td className="border p-2">{tenant.phone || "—"}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/inquilinos/ver/${tenant._id}`)}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => navigate(`/admin/inquilinos/editar/${tenant._id}`)}
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
      )}
    </div>
  );
}

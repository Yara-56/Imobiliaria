// src/pages/admin/TenantDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTenant } from "../../services/tenantService";

export default function TenantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTenant() {
      try {
        setLoading(true);
        const data = await getTenant(id);
        setTenant(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do inquilino.");
      } finally {
        setLoading(false);
      }
    }

    fetchTenant();
  }, [id]);

  if (loading) return <p>Carregando inquilino...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tenant) return <p>Inquilino não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Detalhes do Inquilino</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-medium">Nome:</p>
          <p>{tenant.name}</p>
        </div>
        <div>
          <p className="font-medium">CPF:</p>
          <p>{tenant.cpf}</p>
        </div>
        <div>
          <p className="font-medium">Email:</p>
          <p>{tenant.email || "—"}</p>
        </div>
        <div>
          <p className="font-medium">Telefone:</p>
          <p>{tenant.phone || "—"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="font-medium">Carta de Fiança / Observações:</p>
          <p>{tenant.suretyLetter || "—"}</p>
        </div>
      </div>

      {/* Documentos */}
      {tenant.documents && tenant.documents.length > 0 && (
        <div className="mb-6">
          <p className="font-medium mb-2">Documentos:</p>
          <ul className="list-disc list-inside">
            {tenant.documents.map((doc, idx) => (
              <li key={idx}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/inquilinos")}
          className="px-5 py-2 border rounded hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={() => navigate(`/admin/inquilinos/editar/${id}`)}
          className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Editar
        </button>
      </div>
    </div>
  );
}

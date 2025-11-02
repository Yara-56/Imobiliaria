// src/pages/admin/TenantView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTenant, deleteTenant } from "../../services/tenantService";

export default function TenantView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchTenant() {
      try {
        setLoading(true);
        const data = await getTenant(id);
        setTenant(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar o inquilino.");
      } finally {
        setLoading(false);
      }
    }
    fetchTenant();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente deletar este inquilino?")) return;
    setDeleting(true);
    try {
      await deleteTenant(id);
      navigate("/admin/inquilinos", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Carregando inquilino...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tenant) return <p>Inquilino não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Detalhes do Inquilino</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nome:</strong> {tenant.name}</p>
          <p><strong>CPF:</strong> {tenant.cpf}</p>
          <p><strong>Email:</strong> {tenant.email || "—"}</p>
          <p><strong>Telefone:</strong> {tenant.phone || "—"}</p>
        </div>
        <div>
          <p><strong>Carta de Fiança:</strong></p>
          <p>{tenant.suretyLetter || "—"}</p>
        </div>
      </div>

      {/* Documentos */}
      {tenant.documents?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Documentos</h2>
          <ul className="list-disc list-inside">
            {tenant.documents.map((doc, index) => (
              <li key={index}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name || `Documento ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/admin/inquilinos")}
          className="px-5 py-2 border rounded hover:bg-gray-50"
        >
          Voltar
        </button>
        <button
          onClick={() => navigate(`/admin/inquilinos/editar/${id}`)}
          className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          disabled={deleting}
        >
          {deleting ? "Deletando..." : "Deletar"}
        </button>
      </div>
    </div>
  );
}

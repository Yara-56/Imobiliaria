// src/pages/admin/EditTenant.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTenant, updateTenant } from "../../services/tenantService";

export default function EditTenant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suretyLetter, setSuretyLetter] = useState("");
  const [newDocuments, setNewDocuments] = useState([]);

  useEffect(() => {
    async function fetchTenant() {
      try {
        setLoading(true);
        const data = await getTenant(id);
        setTenant(data);
        setName(data.name || "");
        setCpf(data.cpf || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setSuretyLetter(data.suretyLetter || "");
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do inquilino.");
      } finally {
        setLoading(false);
      }
    }

    fetchTenant();
  }, [id]);

  const handleFileChange = (e) => {
    setNewDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("cpf", cpf);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("suretyLetter", suretyLetter);

    // Adiciona os novos documentos
    for (let i = 0; i < newDocuments.length; i++) {
      formData.append("documents[]", newDocuments[i]);
    }

    try {
      setSaving(true);
      await updateTenant(id, formData);
      navigate(`/admin/inquilinos/ver/${id}`);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Verifique os dados e tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Carregando inquilino...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tenant) return <p>Inquilino não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold mb-4">Editar Inquilino</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Telefone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Carta de Fiança</label>
          <textarea
            value={suretyLetter}
            onChange={(e) => setSuretyLetter(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Documentos existentes */}
        {tenant.documents?.length > 0 && (
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-1">Documentos Existentes</h2>
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

        {/* Upload de novos documentos */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Adicionar Documentos</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/inquilinos/ver/${id}`)}
            className="px-5 py-2 border rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

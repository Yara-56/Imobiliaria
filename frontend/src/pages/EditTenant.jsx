import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faUserEdit,
  faTrashCan,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getTenantById,
  updateTenant,
  deleteTenant,
} from "../services/tenantService";

export default function EditTenant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    suretyLetter: "",
  });

  const [existingDocs, setExistingDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // EFEITO PARA CARREGAR OS DADOS DO INQUILINO
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getTenantById(id);
        setForm({
          name: data?.name || "",
          cpf: data?.cpf || "",
          email: data?.email || "",
          phone: data?.phone || "",
          suretyLetter: data?.suretyLetter || "",
        });
        setExistingDocs(data?.documents || []);
      } catch (err) {
        setErrorMessage("Falha ao carregar dados do inquilino.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    /* Ignorado, pois os campos são readonly */
  };
  const onFilesChange = () => {};
  const onRemoveDoc = () => {
    alert("Use o botão 'Editar Dados' para fazer alterações.");
  };

  if (loading)
    return <div className="p-8">Carregando detalhes do inquilino...</div>;

  return (
    <>
      {/* --- CABEÇALHO DA PÁGINA --- */}
      <div className="px-6 pt-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Detalhes do Inquilino</h1>
        <button
          type="button"
          onClick={() => navigate("/tenants")}
          className="text-gray-600 hover:text-gray-800 transition"
          title="Voltar para a lista"
        >
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            className="mr-2 transform rotate-180"
          />{" "}
          Voltar
        </button>
      </div>

      <div className="px-6 py-4 max-w-5xl mx-auto">
        {errorMessage && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Dados do inquilino */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Dados do inquilino
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nome *
              </label>
              <input
                name="name"
                value={form.name}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                CPF *
              </label>
              <input
                name="cpf"
                value={form.cpf}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                E-mail
              </label>
              <input
                name="email"
                value={form.email}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Telefone
              </label>
              <input
                name="phone"
                value={form.phone}
                readOnly
                className="border rounded px-3 py-2 w-full bg-gray-50"
              />
            </div>
          </div>

          {/* --- CAMPO CARTA DE FIANÇA --- */}
          <div className="mt-6 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Carta de Fiança / Observações
            </label>
            <textarea
              name="suretyLetter"
              value={form.suretyLetter}
              readOnly
              rows="3"
              className="border rounded px-3 py-2 w-full resize-none bg-gray-50"
            />
          </div>

          {/* --- ÁREA DE DOCUMENTOS (Visualização) --- */}
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Documentos do Inquilino
            </h3>

            {/* 1. DOCUMENTOS EXISTENTES (Exibição) */}
            {existingDocs?.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {existingDocs.map((doc) => (
                  <li
                    key={doc._id}
                    className="flex items-center justify-between border rounded px-3 py-2 bg-gray-50"
                  >
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                      title={doc.name}
                    >
                      <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="mr-2"
                      />
                      {doc.name || `Documento ${doc._id}`}
                    </a>
                    {/* Botão de Excluir removido */}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Nenhum documento anexado.
              </p>
            )}

            {/* Área de upload removida no modo de visualização */}
          </div>
        </div>

        {/* --- AÇÕES: SOMENTE BOTÃO DE EDIÇÃO (CORRIGIDO PARA NOVA ROTA) --- */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            // --- ROTA CORRIGIDA --- Leva para a nova URL de edição
            onClick={() => navigate(`/tenants/${id}/edit`)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
            Editar Dados
          </button>
        </div>
      </div>
    </>
  );
}

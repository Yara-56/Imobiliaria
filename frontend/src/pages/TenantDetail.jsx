import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTenantById } from "../services/tenantService"; // Importe seu serviço
import {
  faPenToSquare,
  faArrowLeft,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TenantDetail() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar os dados do inquilino
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTenantById(id);
        setTenant(data);
      } catch (err) {
        setError("Falha ao carregar dados do inquilino.");
        console.error("Erro ao buscar inquilino:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Funções de formatação (opcional, mas ajuda)
  const formatCPF = (cpf) =>
    cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") || "—";
  const formatPhone = (phone) =>
    phone?.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") || "—";

  if (loading) {
    return <div className="p-8">Carregando detalhes do inquilino...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!tenant) {
    return <div className="p-8">Inquilino não encontrado.</div>;
  }

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  return (
    <div className="px-6 py-4 max-w-5xl mx-auto">
      {/* --- CABEÇALHO --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Detalhes do Inquilino</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/tenants")} // Botão para voltar para a lista
            className="text-gray-600 hover:text-gray-800 transition"
            title="Voltar para a Lista"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Voltar
          </button>
          <button
            onClick={() => navigate(`/tenants/edit/${id}`)} // ATENÇÃO: Verifique sua rota de edição
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
            Editar Dados
          </button>
        </div>
      </div>

      {/* --- BLOCO DE DADOS --- */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Dados do inquilino
        </h3>

        {/* --- INFORMAÇÕES PESSOAIS (Somente Leitura) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Nome
            </label>
            <p className="text-base text-gray-900">{tenant.name || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              CPF
            </label>
            <p className="text-base text-gray-900">{formatCPF(tenant.cpf)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              E-mail
            </label>
            <p className="text-base text-gray-900">{tenant.email || "—"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Telefone
            </label>
            <p className="text-base text-gray-900">
              {formatPhone(tenant.phone)}
            </p>
          </div>
        </div>

        {/* --- CARTA DE FIANÇA --- */}
        <div className="mt-6 pt-4 border-t">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Carta de Fiança / Observações
          </label>
          <p className="text-base text-gray-900 whitespace-pre-wrap">
            {tenant.suretyLetter || "Nenhuma observação."}
          </p>
        </div>

        {/* --- CORREÇÃO AQUI: LISTAGEM DE DOCUMENTOS --- */}
        <div className="mt-8 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Documentos do Inquilino
          </h3>

          {/* Verifica se o array 'documents' existe e tem itens */}
          {tenant.documents && tenant.documents.length > 0 ? (
            <ul className="space-y-2">
              {tenant.documents.map((doc) => (
                <li
                  key={doc._id}
                  className="flex items-center justify-between border rounded px-4 py-3 bg-gray-50"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-medium truncate"
                    title={doc.name}
                  >
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="mr-3"
                    />
                    {doc.name || `Documento ${doc._id}`}
                  </a>
                  {/* Você pode adicionar um botão de download ou exclusão aqui se quiser */}
                </li>
              ))}
            </ul>
          ) : (
            // Mensagem se não houver documentos
            <p className="text-sm text-gray-600">Nenhum documento anexado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

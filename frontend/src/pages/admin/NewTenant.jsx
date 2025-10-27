import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenant } from '../../services/tenantService';
import { listTemplates } from '../../services/contractTemplateService';

const DOCUMENTS = [
  { key: 'idDoc', label: 'Documento de identificação' },
  { key: 'leaseContract', label: 'Contrato de locação' },
  { key: 'guaranteeLetter', label: 'Carta de fiança' },
  { key: 'residenceProof', label: 'Comprovante de residência' },
  { key: 'inspectionReport', label: 'Laudo de vistoria' },
];
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Topbar from "../components/Topbar";
import { createTenant } from "../services/tenantService"; // Importa a função REAL

export default function NewTenant() {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    phone: "",
    suretyLetter: "", // <-- ADICIONADO: Campo Carta de Fiança
  });

  const [newFiles, setNewFiles] = useState([]); // <-- ADICIONADO: Estado para novos arquivos
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFilesChange = (e) => {
    setNewFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Cria um objeto FormData para enviar JSON e Arquivos juntos
      const dataToSend = new FormData();

      // Anexa os campos de texto JSON (exceto arquivos)
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });

      // Anexa os novos arquivos (campo 'documents[]' é o que o Multer espera)
      newFiles.forEach((file) => {
        dataToSend.append("documents[]", file);
      });

      // --- CHAMA A API DE VERDADE ---
      // A função createTenant deve estar adaptada no tenantService para aceitar FormData
      await createTenant(dataToSend);

      setSuccessMessage("Inquilino salvo com sucesso! Redirecionando...");

      setTimeout(() => {
        navigate("/tenants");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar inquilino:", error);
      let message = "Falha ao salvar alterações.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = `Detalhe: ${error.response.data.message}`;
      } else if (error.message) {
        message = `Detalhe: ${error.message}`;
      }
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Não use Topbar aqui para evitar a barra de pesquisa duplicada */}

      <form onSubmit={handleSubmit} className="px-6 py-4 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Dados do inquilino
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna da Esquerda */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {/* Coluna da Direita */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* --- NOVO CAMPO: CARTA DE FIANÇA --- */}
          <div className="mt-6 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Carta de Fiança / Observações
            </label>
            <textarea
              name="suretyLetter"
              value={formData.suretyLetter}
              onChange={handleChange}
              rows="3"
              placeholder="Detalhes sobre a carta de fiança ou observações importantes..."
              className="border rounded px-3 py-2 w-full resize-none"
            />
          </div>

          {/* --- ÁREA DE DOCUMENTOS (Upload) --- */}
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Documentos do Inquilino
            </h3>

            {/* Adicionar novos */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Escolher documentos
              </label>
              <input type="file" multiple onChange={onFilesChange} />
              {newFiles?.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {newFiles.length} arquivo(s) selecionado(s)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Área para mostrar as mensagens */}
        <div className="mt-6 text-center h-5">
          {successMessage && (
            <p className="text-sm text-green-600">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
        </div>

        {/* Botões Salvar/Cancelar */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/tenants")}
            disabled={isSubmitting}
            className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg transition disabled:opacity-50 disabled:bg-blue-400"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </>
  );
}

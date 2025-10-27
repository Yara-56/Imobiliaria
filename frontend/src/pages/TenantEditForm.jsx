import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faUserEdit,
  faTrashCan,
  faExternalLinkAlt,
  faFloppyDisk,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getTenantById,
  updateTenant,
  deleteTenant,
} from "../services/tenantService";

// --- Função auxiliar que pode estar faltando ou incorreta aqui ---
const cleanValue = (key, value) => {
  // Essa função provavelmente estava aqui, mas pode ter variações
  if (key === "cpf" || key === "phone") {
    return value ? value.replace(/[^\d]/g, "") : "";
  }
  return value;
};
// -----------------------------------------------------------------

export default function TenantEditForm() {
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
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
        console.error("Erro ao buscar inquilino:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFilesChange = (e) => {
    // Usa '...' para adicionar os novos arquivos aos que já estavam selecionados
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    // Limpa o valor do input file para que o mesmo arquivo possa ser selecionado novamente
    e.target.value = null;
  };

  // Função para remover um arquivo recém-selecionado
  const onRemoveNewFile = (indexToRemove) => {
    setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const onRemoveDoc = async (docId) => {
    if (!window.confirm("Excluir este documento?")) return;
    setErrorMessage(null);
    alert(
      "Função de exclusão de documento desabilitada no front-end para teste. Consulte o console para mais detalhes."
    ); // Essa função precisa de uma implementação de API no backend que remova o documento do array 'documents'
  };

  // --- FUNÇÃO DE SUBMISSÃO ONDE A LIMPEZA E O UPLOAD OCORREM ---
  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const dataToSend = new FormData(); // 1. Itera sobre os campos do formulário e APLICA A LIMPEZA

      Object.keys(form).forEach((key) => {
        const cleanedValue = cleanValue(key, form[key]);
        // Adiciona a chave limpa ao FormData
        dataToSend.append(key, cleanedValue);
      }); // 2. Adiciona os novos arquivos

      newFiles.forEach((file) => {
        // ESTA CHAVE ESTAVA ERRADA NO SEU CÓDIGO ORIGINAL, MAS ESTAMOS REVERTENDO AGORA.
        dataToSend.append("documents[]", file);
      });

      await updateTenant(id, dataToSend); // Limpa os arquivos recém-selecionados após o sucesso

      setNewFiles([]);

      setSuccessMessage(
        "Inquilino atualizado com sucesso! Redirecionando para a lista..."
      ); // Redireciona com o flag de refresh

      setTimeout(() => {
        navigate("/tenants", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error("Erro na atualização:", err);
      setErrorMessage(
        err.response?.data?.error || "Falha ao atualizar inquilino."
      );
    } finally {
      setSaving(false);
    }
  };

  // --- FUNÇÃO DE DELEÇÃO ---
  const onDelete = async () => {
    if (
      !window.confirm(
        `Tem certeza que deseja DELETAR o inquilino ${form.name}?`
      )
    )
      return;
    setDeleting(true);
    setErrorMessage(null);

    try {
      await deleteTenant(id);
      setSuccessMessage("Inquilino deletado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/tenants", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error("Erro na exclusão:", err);
      setErrorMessage(
        err.response?.data?.error || "Falha ao deletar inquilino."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">Carregando dados do inquilino...</div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
           {" "}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
               {" "}
        <FontAwesomeIcon icon={faUserEdit} className="mr-3 text-blue-600" />   
            Editar Inquilino      {" "}
      </h1>
            {/* Mensagens */}     {" "}
      {errorMessage && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                    Erro: {errorMessage}       {" "}
        </div>
      )}
           {" "}
      {successMessage && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
                    Sucesso: {successMessage}       {" "}
        </div>
      )}
           {" "}
      <form onSubmit={onSubmit}>
                {/* Dados Pessoais */}       {" "}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                   {" "}
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-700">
            Dados Pessoais
          </h3>
                   {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome *
              </label>
                           {" "}
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
                         {" "}
            </div>
                        {/* Telefone */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone
              </label>
                           {" "}
              <input
                type="text"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
                         {" "}
            </div>
                        {/* CPF */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700"
              >
                CPF *
              </label>
                           {" "}
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
                         {" "}
            </div>
                        {/* E-mail */}           {" "}
            <div>
                           {" "}
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
                           {" "}
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
                {/* Carta de Fiança / Observações */}       {" "}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                   {" "}
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-700">
            Observações
          </h3>
                   {" "}
          <label
            htmlFor="suretyLetter"
            className="block text-sm font-medium text-gray-700"
          >
            Carta de Fiança / Observações
          </label>
                   {" "}
          <textarea
            id="suretyLetter"
            name="suretyLetter"
            rows="3"
            value={form.suretyLetter}
            onChange={onChange}
            placeholder="Detalhes sobre a carta de fiança ou observações importantes..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          ></textarea>
                 {" "}
        </div>
                {/* Documentos do Inquilino - Existentes e Novos */}       {" "}
        <div className="mb-6 p-4 border rounded-lg">
                   {" "}
          <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">
            Documentos
          </h3>
                    {/* Documentos Existentes */}         {" "}
          {existingDocs.length > 0 && (
            <div className="mb-4">
                           {" "}
              <p className="text-sm font-medium text-gray-600 mb-2">
                Arquivos Atuais:
              </p>
                           {" "}
              <ul className="space-y-2">
                               {" "}
                {existingDocs.map((doc, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded-md text-sm"
                  >
                                       {" "}
                    <span className="truncate">{doc.name}</span>               
                       {" "}
                    <div className="flex space-x-2 ml-4">
                                           {" "}
                      {/* O URL DEVE SER AJUSTADO PARA O ENDEREÇO DO SEU BACKEND */}
                                           {" "}
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                                               {" "}
                        <FontAwesomeIcon icon={faExternalLinkAlt} />           
                                 {" "}
                      </a>
                                           {" "}
                      <button
                        type="button"
                        onClick={() => onRemoveDoc(doc._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                                               {" "}
                        <FontAwesomeIcon icon={faTrashCan} />                   
                         {" "}
                      </button>
                                         {" "}
                    </div>
                                     {" "}
                  </li>
                ))}
                           {" "}
              </ul>
                         {" "}
            </div>
          )}
                    {/* Input para Novos Arquivos */}         {" "}
          <p className="text-sm font-medium text-gray-600 mb-2 mt-4 border-t pt-4">
            Adicionar Novos Arquivos:
          </p>
                   {" "}
          <input
            type="file"
            multiple
            onChange={onFilesChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
                    {/* Arquivos Novos Selecionados */}         {" "}
          {newFiles.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
                           {" "}
              <p className="text-sm font-medium text-gray-700 mb-2">
                {newFiles.length} novo(s) arquivo(s) a enviar:
              </p>
                           {" "}
              <ul className="space-y-1">
                               {" "}
                {newFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-sm text-gray-600"
                  >
                                        {file.name}                   {" "}
                    <button
                      type="button"
                      onClick={() => onRemoveNewFile(index)}
                      className="text-red-500 hover:text-red-700 ml-4 font-bold"
                    >
                                            <FontAwesomeIcon icon={faTimes} /> 
                                       {" "}
                    </button>
                                     {" "}
                  </li>
                ))}
                           {" "}
              </ul>
                         {" "}
            </div>
          )}
                 {" "}
        </div>
                {/* Botões de Ação */}       {" "}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
                   {" "}
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            disabled={deleting || saving}
          >
                        <FontAwesomeIcon icon={faTrashCan} className="mr-2" /> 
                      {deleting ? "Deletando..." : "Deletar Inquilino"}         {" "}
          </button>
                   {" "}
          <div className="flex space-x-4">
                       {" "}
            <button
              type="button"
              onClick={() => navigate("/tenants")}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={saving || deleting}
            >
                            Cancelar            {" "}
            </button>
                       {" "}
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              disabled={saving || deleting}
            >
                           {" "}
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />         
                  {saving ? "Salvando..." : "Salvar Alterações"}           {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </form>
         {" "}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";

// Objeto para traduzir as chaves do backend para o PT-BR
const fieldTranslations = {
  cep: "CEP",
  sqls: "SQLS",
  street: "Rua",
  number: "Número",
  bairro: "Bairro",
  city: "Cidade",
  state: "Estado",
  status: "Status",
};

export default function PropertyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cep: "",
    sqls: "",
    street: "",
    number: "",
    bairro: "",
    city: "",
    state: "",
    status: "",
  });

  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  // ✅ NOVO: Estado para guardar os campos com erro e a mensagem do primeiro erro
  const [fieldErrors, setFieldErrors] = useState({});
  const [firstError, setFirstError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // ✅ Limpa o erro do campo específico ao digitar
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      // Se era o "primeiro erro", limpa a mensagem
      if (firstError === name) {
        setFirstError(null);
      }
    }
  };

  const onFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  // ✅ ATUALIZADO: Lógica de onSubmit com erros no formulário
  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // ✅ Reseta os erros antes de tentar salvar
    setFieldErrors({});
    setFirstError(null);
    setSaving(true);

    try {
      // Tenta criar a propriedade
      await createProperty(form, files);
      
      // SUCESSO!
      // (Poderíamos mostrar uma barra de sucesso, mas por enquanto vamos direto)
      navigate("/admin/imoveis");

    } catch (err) {
      // ERRO!
      
      // ✅ NOVO: Console de erro muito mais detalhado
      console.error(
        "❌ Erro ao Salvar Formulário de Imóvel:", 
        { 
          payloadEnviado: form, 
          arquivos: files.map(f => f.name), 
          erroDaApi: err.response?.data 
        }
      );

      // Tenta extrair os campos que falharam
      if (err.response && err.response.data && err.response.data.fields) {
        const { fields } = err.response.data; // ex: { cep: {...}, street: {...} }
        const fieldKeys = Object.keys(fields); // ex: ['cep', 'street']

        // 1. Guarda TODOS os campos que falharam para o destaque vermelho
        const errorHighlights = Object.fromEntries(fieldKeys.map(key => [key, true]));
        setFieldErrors(errorHighlights);

        // 2. Pega o PRIMEIRO campo que falhou para a mensagem
        setFirstError(fieldKeys[0]);

      } else {
        // Erro genérico (ex: 500 - Server Error)
        // Você pode ter um estado para um banner de erro no topo
        alert("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };
  
  // Função auxiliar para mostrar a mensagem de erro
  const renderErrorMessage = (fieldName) => {
    if (firstError !== fieldName) return null; // Só mostra no primeiro

    const translatedName = fieldTranslations[fieldName] || fieldName;
    return (
      <p className="text-red-600 text-sm mt-1">
        O campo '{translatedName}' é obrigatório.
      </p>
    );
  };

  return (
    // O modal foi removido
    <form onSubmit={onSubmit} className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Novo Imóvel</h1>

      {/* Dados do imóvel */}
      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-house" /> Dados do imóvel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* --- CAMPO CEP --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">CEP</label>
            <input
              name="cep"
              value={form.cep}
              onChange={onChange}
              placeholder="Ex: 35160-133"
              // ✅ Classe condicional para borda vermelha
              className={`border rounded px-3 py-2 w-full ${fieldErrors.cep ? 'border-red-500' : 'border-gray-300'}`}
              autoComplete="off"
            />
            {/* ✅ Mensagem de erro (se for o primeiro) */}
            {renderErrorMessage('cep')}
          </div>

          {/* --- CAMPO SQLS --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">SQLS</label>
            <input
              name="sqls"
              value={form.sqls}
              onChange={onChange}
              placeholder="Ex: 12930423546793023"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.sqls ? 'border-red-500' : 'border-gray-300'}`}
              autoComplete="off"
            />
            {renderErrorMessage('sqls')}
          </div>

          {/* --- CAMPO RUA --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rua</label>
            <input
              name="street"
              value={form.street}
              onChange={onChange}
              placeholder="Digite o nome da rua"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.street ? 'border-red-500' : 'border-gray-300'}`}
            />
            {renderErrorMessage('street')}
          </div>

          {/* --- CAMPO NÚMERO --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Número</label>
            <input
              name="number"
              value={form.number}
              onChange={onChange}
              placeholder="Ex: 129"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.number ? 'border-red-500' : 'border-gray-300'}`}
            />
            {renderErrorMessage('number')}
          </div>

          {/* --- CAMPO BAIRRO --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bairro</label>
            <input
              name="bairro"
              value={form.bairro}
              onChange={onChange}
              placeholder="Digite o nome do bairro"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.bairro ? 'border-red-500' : 'border-gray-300'}`}
            />
            {renderErrorMessage('bairro')}
          </div>

          {/* --- CAMPO CIDADE --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cidade</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Ex: Coronel Fabriciano"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
            {renderErrorMessage('city')}
          </div>

          {/* --- CAMPO ESTADO --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <input
              name="state"
              value={form.state}
              onChange={onChange}
              placeholder="Ex: MG"
              className={`border rounded px-3 py-2 w-full ${fieldErrors.state ? 'border-red-500' : 'border-gray-300'}`}
            />
            {renderErrorMessage('state')}
          </div>

          {/* --- CAMPO STATUS --- */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className={`border rounded px-3 py-2 w-full ${fieldErrors.status ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione o status</option>
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Under Maintenance">Manutenção</option>
            </select>
            {renderErrorMessage('status')}
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-folder" /> Documentos do imóvel
        </h2>

        <input type="file" multiple onChange={onFilesChange} className="block" />
        {files?.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {files.length} arquivo(s) selecionado(s)
          </p>
        )}
      </div>

      {/* Botão */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
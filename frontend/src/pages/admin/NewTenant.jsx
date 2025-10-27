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

export default function NewTenant() {
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    rg: '',
    templateId: ''
  });

  const [documents, setDocuments] = useState({});
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const data = await listTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Erro ao carregar modelos:', error);
      }
    }
    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setForm({
      name: '',
      cpf: '',
      email: '',
      phone: '',
      birthdate: '',
      address: '',
      rg: '',
      templateId: ''
    });
    setDocuments({});
  };

  const handleFileChange = (key, file) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(documents).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      await createTenant(formData);
      alert('✅ Inquilino cadastrado com sucesso!');
      navigate('/tenants');
    } catch (error) {
      alert('❌ Erro ao cadastrar inquilino.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Perfil do Inquilino</h2>

      {/* Seção 1 */}
      <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          📋 Dados do inquilino
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              name="name"
              placeholder="Nome *"
              value={form.name}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="phone"
              placeholder="Telefone *"
              value={form.phone}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="email"
              placeholder="E-mail *"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="cpf"
              placeholder="CPF *"
              value={form.cpf}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="address"
              placeholder="Endereço *"
              value={form.address}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              name="rg"
              placeholder="RG *"
              value={form.rg}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
            <select
              name="templateId"
              value={form.templateId}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Selecione um modelo de contrato</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
            >
              Limpar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-blue-300 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200"
            >
              Salvar
            </button>
          </div>
        </form>
      </section>

      {/* Seção 2 */}
      <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          📎 Documentos do inquilino
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DOCUMENTS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center justify-between bg-blue-50 border border-dashed border-blue-200 rounded-lg p-4 min-h-[160px] transition hover:bg-blue-100 hover:border-blue-500"
            >
              <label className="text-sm font-medium text-blue-700 mb-2 text-center">
                {label}
              </label>

              <label className="flex flex-col items-center gap-2 cursor-pointer w-full">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileChange(key, e.target.files[0])}
                />
                <div className="text-2xl text-blue-400 hover:text-blue-600 transition">
                  {documents[key] ? '📄' : '📁➕'}
                </div>
                {documents[key] && (
                  <div className="text-xs text-gray-700 text-center break-words max-w-[180px]">
                    {documents[key].name}
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

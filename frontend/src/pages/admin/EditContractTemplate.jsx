import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, updateTemplate } from '../../services/contractTemplateService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditContractTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const data = await getTemplateById(id);
        setTemplate({ title: data.title, content: data.content });
      } catch (error) {
        console.error('Erro ao carregar modelo:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [id]);

  const handleChange = (field, value) => {
    setTemplate(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateTemplate(id, template);
      navigate('/templates');
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600 text-base">Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Editar Modelo de Contrato</h2>

      <div className="mb-5">
        <label className="block mb-2 font-medium text-sm text-gray-700">Título</label>
        <input
          type="text"
          value={template.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="Digite o título do modelo"
          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-sm text-gray-700">Conteúdo</label>
        <ReactQuill
          value={template.content}
          onChange={value => handleChange('content', value)}
          theme="snow"
          className="bg-white"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-6 py-2 rounded-md text-white text-sm font-medium transition-colors
          ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {saving ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { createTemplate } from '../../services/contractTemplateService';
import 'react-quill/dist/quill.snow.css';

export default function CreateContractTemplate() {
  const [template, setTemplate] = useState({ title: '', content: '' });
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!template.title || !template.content) {
      alert('Preencha todos os campos.');
      return;
    }

    await createTemplate(template);
    alert('Modelo criado com sucesso!');
    navigate('/templates');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold text-blue-700 mb-6">Novo Modelo de Contrato</h2>

      <input
        type="text"
        placeholder="Título do modelo"
        value={template.title}
        onChange={(e) => setTemplate({ ...template, title: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mb-6">
        <ReactQuill
          value={template.content}
          onChange={(value) => setTemplate({ ...template, content: value })}
          className="bg-white"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Salvar Modelo
      </button>
    </div>
  );
}

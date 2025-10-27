import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listTemplates, deleteTemplate } from '../../services/contractTemplateService';

export default function ContractTemplateList() {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTemplates() {
      const data = await listTemplates();
      setTemplates(data);
    }
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este modelo?');
    if (!confirm) return;
    await deleteTemplate(id);
    setTemplates(templates.filter((t) => t._id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Modelos de Contrato</h2>
        <button
          onClick={() => navigate('/templates/new')}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + Novo Modelo
        </button>
      </div>

      <table className="w-full border-collapse bg-white rounded-md shadow-sm overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-500 font-semibold">
          <tr>
            <th className="text-left px-4 py-3">Título</th>
            <th className="text-left px-4 py-3">Última atualização</th>
            <th className="text-left px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr
              key={template._id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-800">{template.title}</td>
              <td className="px-4 py-3 text-gray-800">
                {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-gray-800">
                <button
                  onClick={() => navigate(`/templates/${template._id}`)}
                  className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(template._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

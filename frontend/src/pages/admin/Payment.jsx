import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faUser,
  faDownload,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { listTenants } from '../../services/tenantService';

export default function Payment() {
  const [step, setStep] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTenants() {
      try {
        const response = await listTenants();
        setTenants(response);
      } catch (error) {
        console.error('Error loading tenants:', error);
      }
    }
    loadTenants();
  }, []);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <StepProgress etapaAtual={step} />

      {step === 1 && (
        <section className="bg-white rounded-lg shadow-sm p-6">
          <input
            type="text"
            placeholder="Buscar inquilino..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm"
          />

          <ul className="space-y-2">
            {filteredTenants.map((tenant) => (
              <li
                key={tenant._id}
                onClick={() => setSelectedTenant(tenant)}
                className={`border rounded-md px-4 py-2 flex items-center cursor-pointer transition 
                  ${selectedTenant?._id === tenant._id ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3" />
                {tenant.name}
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-6">
            <button
              onClick={next}
              disabled={!selectedTenant}
              className={`px-5 py-2 rounded-md font-medium text-white transition-colors 
                ${selectedTenant ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Próximo
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo do Pagamento</h3>
          <p><strong>Inquilino:</strong> {selectedTenant?.name}</p>
          <p><strong>Valor:</strong> R$ 1.200,00</p>
          <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={back}
              className="px-5 py-2 rounded-md bg-gray-300 text-black hover:bg-gray-400 transition"
            >
              Voltar
            </button>
            <button
              onClick={next}
              className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Receber
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end gap-4 mb-4">
            <FontAwesomeIcon icon={faDownload} className="text-gray-600 text-lg hover:text-blue-600 cursor-pointer" title="Download PDF" />
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 text-lg hover:text-blue-600 cursor-pointer" title="Enviar por e-mail" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recibo de Pagamento</h3>
            <p><strong>Inquilino:</strong> {selectedTenant?.name}</p>
            <p><strong>Valor:</strong> R$ 1.200,00</p>
            <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Método:</strong> Cartão de Crédito</p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Novo Pagamento
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

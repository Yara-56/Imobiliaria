import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import Topbar from '../../components/Topbar';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { getContractById } from '../../services/contractService';

export default function ContractView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getContractById(id);
      setContract(data);
    }
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menu />
      <div className="flex-1 flex flex-col">
        <Topbar icon={faFileContract} title="Contrato" subtitle="Visualização de Contrato" />

        <main className="flex-1 px-6 py-8 w-full max-w-5xl mx-auto">
          {contract ? (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 text-gray-800 leading-relaxed font-sans">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                {contract.template?.title || 'Contrato'}
              </h2>

              <div
                className="bg-gray-50 border border-gray-300 rounded-md p-4 md:p-6 whitespace-pre-wrap text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: contract.finalText }}
              />

              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Imprimir
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-8">Carregando contrato...</p>
          )}
        </main>
      </div>
    </div>
  );
}

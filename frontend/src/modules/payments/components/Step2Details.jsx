import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCreditCard } from '@fortawesome/free-solid-svg-icons';

export default function Step2Details({ selectedTenant, onNextStep, onPrevStep }) {
  if (!selectedTenant) return null;

  return (
    <section className="bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h3 className="text-xl font-bold border-b pb-3 mb-4 text-gray-800">Detalhes do Pagamento</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Inquilino</p>
          <p className="text-lg font-semibold text-gray-800">{selectedTenant.name}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-500">Valor a Receber</p>
          <p className="text-2xl font-bold text-blue-600">R$ 1.200,00</p>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg space-y-2">
        <p className="text-md font-medium text-gray-700 flex items-center">
          <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-blue-500" />
          Método de Pagamento (Simulação)
        </p>
        {/* Aqui iria a lógica real de seleção/inserção de dados de pagamento */}
        <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:border-blue-500">
          <option>Cartão de Crédito</option>
          <option>PIX</option>
          <option>Transferência Bancária</option>
        </select>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <button
          onClick={onPrevStep}
          className="flex items-center px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Voltar
        </button>
        <button
          onClick={onNextStep}
          className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-lg"
        >
          Confirmar Recebimento
        </button>
      </div>
    </section>
  );
}
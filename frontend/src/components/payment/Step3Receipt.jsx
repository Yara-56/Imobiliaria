import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Step3Receipt({ selectedTenant, onStartNewPayment }) {
  if (!selectedTenant) return null;
  
  return (
    <section className="bg-white rounded-xl shadow-lg p-8 space-y-8 text-center">
      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl mx-auto" />
      <h3 className="text-2xl font-bold text-gray-800">Pagamento Recebido com Sucesso!</h3>
      
      {/* Detalhes do Recibo */}
      <div className="border border-dashed border-gray-300 p-6 rounded-lg text-left inline-block w-full max-w-sm">
        <h4 className="font-semibold text-lg mb-3">Recibo</h4>
        <div className="space-y-1 text-sm">
          <p><strong className="text-gray-600">Inquilino:</strong> <span className="float-right">{selectedTenant.name}</span></p>
          <p><strong className="text-gray-600">Valor:</strong> <span className="float-right font-bold text-green-600">R$ 1.200,00</span></p>
          <p><strong className="text-gray-600">Data:</strong> <span className="float-right">{new Date().toLocaleDateString('pt-BR')}</span></p>
          <p><strong className="text-gray-600">Método:</strong> <span className="float-right">Cartão de Crédito (Simulado)</span></p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-center gap-6 mt-8">
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faDownload} className="text-gray-600 text-2xl hover:text-blue-600 cursor-pointer p-2 transition" title="Download PDF" />
          <span className="text-xs text-gray-500 mt-1">Baixar PDF</span>
        </div>
        <div className="flex flex-col items-center">
          <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 text-2xl hover:text-blue-600 cursor-pointer p-2 transition" title="Enviar por e-mail" />
          <span className="text-xs text-gray-500 mt-1">Enviar E-mail</span>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onStartNewPayment}
          className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Novo Pagamento
        </button>
      </div>
    </section>
  );
}
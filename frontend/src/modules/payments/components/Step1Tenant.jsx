// src/components/payment/Step1Tenant.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// CORREÇÃO: Usamos o nome correto do seu arquivo (SearchBarWithHistory)
// e o caminho correto para subir um nível (../)
import SearchBarWithHistory from '../../../shared/components/SearchBarWithHistory.jsx'; 

export default function Step1Tenant({ tenants, selectedTenant, onSelectTenant, onNextStep, isLoading }) {
  return (
    <section className="bg-white rounded-xl shadow-lg p-8">
      {/* O nome do componente usado aqui deve corresponder ao nome importado */}
      <SearchBarWithHistory 
        tenants={tenants} 
        onSelect={onSelectTenant}
        selectedTenant={selectedTenant}
        isLoading={isLoading}
      />
      
      <div className="flex justify-end mt-8 pt-4 border-t border-gray-100">
        <button
          onClick={onNextStep}
          disabled={!selectedTenant}
          className={`px-6 py-3 rounded-xl font-bold text-white transition-colors shadow-lg flex items-center ${
            selectedTenant ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Avançar para Pagamento <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </div>
    </section>
  );
}
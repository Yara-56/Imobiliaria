import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const stepLabels = ['Inquilino', 'Pagamento', 'Comprovante'];

export default function StepIndicator({ currentStep }) {
  const steps = [
    { id: 1, label: 'Inquilino' },
    { id: 2, label: 'Pagamento' },
    { id: 3, label: 'Comprovante' },
  ];

  return (
    <div className="flex justify-between items-center w-full max-w-lg mx-auto py-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            {/* Círculo do Passo */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ease-in-out ${
                step.id === currentStep
                  ? 'bg-blue-600 text-white shadow-lg'
                  : step.id < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.id < currentStep ? <FontAwesomeIcon icon={faCheckCircle} className="text-sm" /> : step.id}
            </div>
            {/* Rótulo do Passo */}
            <span
              className={`text-xs mt-2 ${
                step.id === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {/* Linha de Conexão */}
          {index < steps.length - 1 && (
            <div
              className={`flex-auto h-0.5 mx-2 transition-colors duration-300 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
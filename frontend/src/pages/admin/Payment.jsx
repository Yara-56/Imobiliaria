import React, { useEffect, useState } from 'react';
// Importa o serviço
import { listTenants } from '../../services/tenantService'; 

// Componentes Auxiliares
import StepIndicator from '../../components/StepIndicator'; 

// Componentes de Passo (Localizados em src/components/payment/)
import Step1Tenant from '../../components/payment/Step1Tenant';
import Step2Details from '../../components/payment/Step2Details';
import Step3Receipt from '../../components/payment/Step3Receipt';

const stepLabels = ['Inquilino', 'Pagamento', 'Comprovante'];

export default function Payment() {
  const [step, setStep] = useState(1);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de carregamento de inquilinos
  useEffect(() => {
    async function loadTenants() {
      setIsLoading(true);
      try {
        const response = await listTenants();
        setTenants(Array.isArray(response) ? response : response?.items ?? []);
      } catch (err) {
        console.error('Erro ao carregar inquilinos:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTenants();
  }, []);

  // Lógica de navegação e reset
  const nextStep = () => setStep((s) => Math.min(s + 1, stepLabels.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const startNewPayment = () => {
    setStep(1);
    setSelectedTenant(null);
    // Nota: O histórico é gerenciado internamente pelo SearchBarWithHistory
  };
  
  const handleTenantSelection = (tenant) => {
      setSelectedTenant(tenant);
  }

  // Renderização do passo atual
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Tenant 
            tenants={tenants}
            selectedTenant={selectedTenant}
            onSelectTenant={handleTenantSelection}
            onNextStep={nextStep}
            isLoading={isLoading}
          />
        );
      case 2:
        // Verifica se há inquilino selecionado antes de renderizar o passo 2
        if (!selectedTenant) return null; 
        return (
          <Step2Details 
            selectedTenant={selectedTenant}
            onNextStep={nextStep}
            onPrevStep={prevStep}
          />
        );
      case 3:
        // Verifica se há inquilino selecionado antes de renderizar o passo 3
        if (!selectedTenant) return null;
        return (
          <Step3Receipt 
            selectedTenant={selectedTenant}
            onStartNewPayment={startNewPayment}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Receber Pagamento</h1>
        <div className="text-lg font-medium text-blue-600">Passo {step} de {stepLabels.length}</div>
      </header>

      <StepIndicator currentStep={step} />

      <div className="min-h-[400px]">
        {renderStepContent()}

        {/* Mensagem de segurança caso a navegação falhe */}
        {(step > 1 && !selectedTenant) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            ⚠️ Erro de navegação. Volte ao primeiro passo e selecione um inquilino.
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useState, useCallback } from 'react';

import StepIndicator from '@/shared/components/StepIndicator';

import Step1Tenant from '../components/Step1Tenant';
import Step2Details from '../components/Step2Details';
import Step3Receipt from '../components/Step3Receipt';

import { listTenants } from '../services/payment.service';

const STEP_LABELS = ['Inquilino', 'Pagamento', 'Comprovante'];

export default function PaymentPage() {
  const [step, setStep] = useState(1);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // Load tenants
  // ===============================
  const loadTenants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listTenants();
      setTenants(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar inquilinos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  // ===============================
  // Navigation
  // ===============================
  const nextStep = () =>
    setStep((prev) => Math.min(prev + 1, STEP_LABELS.length));

  const prevStep = () =>
    setStep((prev) => Math.max(prev - 1, 1));

  const startNewPayment = () => {
    setStep(1);
    setSelectedTenant(null);
  };

  // ===============================
  // Render Steps
  // ===============================
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Tenant
            tenants={tenants}
            loading={loading}
            selectedTenant={selectedTenant}
            onSelectTenant={setSelectedTenant}
            onNext={nextStep}
          />
        );

      case 2:
        if (!selectedTenant) return null;

        return (
          <Step2Details
            tenant={selectedTenant}
            onNext={nextStep}
            onBack={prevStep}
          />
        );

      case 3:
        if (!selectedTenant) return null;

        return (
          <Step3Receipt
            tenant={selectedTenant}
            onNewPayment={startNewPayment}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen">

      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">Receber Pagamento</h1>
        <span className="text-blue-600 font-medium">
          Passo {step} de {STEP_LABELS.length}
        </span>
      </header>

      <StepIndicator
        steps={STEP_LABELS}
        currentStep={step}
      />

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <section className="min-h-[400px]">
        {renderStep()}
      </section>

      {step > 1 && !selectedTenant && (
        <div className="bg-yellow-100 p-4 rounded text-center">
          ⚠️ Selecione um inquilino para continuar.
        </div>
      )}
    </div>
  );
}
import { useMemo } from "react";
import { usePayments } from "../../payments/hooks/usePayments.js";
import { useTenants } from "../../tenants/hooks/useTenants.js";

export function useFinancialBI() {
  const { payments } = usePayments();
  const { tenants } = useTenants();

  return useMemo(() => {
    // 1. Faturamento Total (Apenas o que já foi Pago)
    const totalRevenue = payments
      .filter((p) => p.status === "Pago")
      .reduce((acc, p) => acc + p.amount, 0);

    // 2. Faturamento por Plano (Basic, Pro, Enterprise)
    const revenueByPlan = tenants.reduce((acc: any, tenant) => {
      const tenantPayments = payments
        .filter((p) => p.tenantId?._id === tenant._id && p.status === "Pago")
        .reduce((sum, p) => sum + p.amount, 0);
      
      acc[tenant.plan] = (acc[tenant.plan] || 0) + tenantPayments;
      return acc;
    }, {});

    // 3. Taxa de Inadimplência (Pendentes + Atrasados vs Total)
    const totalBilled = payments.reduce((acc, p) => acc + p.amount, 0);
    const churnRisk = totalBilled > 0 
      ? ((totalBilled - totalRevenue) / totalBilled) * 100 
      : 0;

    return { totalRevenue, revenueByPlan, churnRisk, totalPayments: payments.length };
  }, [payments, tenants]);
}
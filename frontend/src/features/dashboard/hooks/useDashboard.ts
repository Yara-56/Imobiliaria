import { useMemo } from "react";
import { usePayments } from "../../payments/hooks/usePayments";
import { useTenants } from "../../tenants/hooks/useTenants";
import { useContracts } from "../../contracts/hooks/useContracts";
import { useProperties } from "../../properties/hooks/useProperties";

export const useDashboard = () => {
  const { payments, isLoading: loadingPayments } = usePayments();
  const { tenants, status } = useTenants();
  const { contracts, isLoading: loadingContracts } = useContracts();
  const { properties, isLoading: loadingProperties } = useProperties();

  const stats = useMemo(() => {

    // ── Financeiro ──────────────────────────────────────────
    const totalReceived = payments
      .filter((p) => p.status === "Pago")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalPending = payments
      .filter((p) => p.status === "Pendente")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalOverdue = payments
      .filter((p) => p.status === "Atrasado")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalBilled = payments.reduce((acc, p) => acc + p.amount, 0);

    const defaultRate = totalBilled > 0
      ? Number(((totalOverdue / totalBilled) * 100).toFixed(1))
      : 0;

    // ── Imóveis ──────────────────────────────────────────────
    const availableProperties = properties.filter(
      (p) => p.status === "Disponível"
    ).length;

    const rentedProperties = properties.filter(
      (p) => p.status === "Alugado"
    ).length;

    const occupancyRate = properties.length > 0
      ? Number(((rentedProperties / properties.length) * 100).toFixed(1))
      : 0;

    // ── Contratos ────────────────────────────────────────────
    const activeContracts = contracts.filter(
      (c) => c.status === "ACTIVE"
    ).length;

    const draftContracts = contracts.filter(
      (c) => c.status === "DRAFT"
    ).length;

    // ── Receita mensal (últimos 6 meses) ─────────────────────
    const revenueByMonth = payments
      .filter((p) => p.status === "Pago")
      .reduce((acc: Record<string, number>, p) => {
        const month = p.referenceMonth ?? p.createdAt?.slice(0, 7) ?? "";
        if (month) acc[month] = (acc[month] || 0) + p.amount;
        return acc;
      }, {});

    const revenueChart = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, value]) => ({
        month,
        value,
        formatted: new Intl.NumberFormat("pt-BR", {
          style:    "currency",
          currency: "BRL",
          notation: "compact",
        }).format(value),
      }));

    // ── Inquilinos por plano ──────────────────────────────────
    const tenantsByPlan = tenants.reduce((acc: Record<string, number>, t) => {
      const plan = t.plan ?? "BASIC";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    return {
      // Financeiro
      totalReceived,
      totalPending,
      totalOverdue,
      totalBilled,
      defaultRate,

      // Imóveis
      totalProperties:     properties.length,
      availableProperties,
      rentedProperties,
      occupancyRate,

      // Contratos
      totalContracts:  contracts.length,
      activeContracts,
      draftContracts,

      // Inquilinos
      totalTenants: tenants.length,
      tenantsByPlan,

      // Pagamentos
      totalPayments: payments.length,

      // Gráficos
      revenueChart,
    };
  }, [payments, tenants, contracts, properties]);

  return {
    ...stats,
    isLoading:
      loadingPayments  ||
      status.isLoading ||
      loadingContracts ||
      loadingProperties,
  };
};
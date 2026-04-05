import { useMemo } from "react";
import { usePayments } from "../../payments/hooks/usePayments";
import { useTenants } from "../../tenants/hooks/useTenants";
import { useContracts } from "../../contracts/hooks/useContracts";
import { useProperties } from "../../properties/hooks/useProperties";

// ── CONSTANTES (evita erro de string) ───────────────────────
const PAYMENT_STATUS = {
  PAID: "Pago",
  PENDING: "Pendente",
  OVERDUE: "Atrasado",
} as const;

const PROPERTY_STATUS = {
  AVAILABLE: "Disponível",
  RENTED: "Alugado",
} as const;

const CONTRACT_STATUS = {
  ACTIVE: "ACTIVE",
  DRAFT: "DRAFT",
} as const;

// ── HOOK ────────────────────────────────────────────────────
export const useDashboard = () => {
  const { payments = [], isLoading: loadingPayments } = usePayments();
  const { tenants = [], isLoading: loadingTenants } = useTenants();
  const { contracts = [], isLoading: loadingContracts } = useContracts();
  const { properties = [], isLoading: loadingProperties } = useProperties();

  const stats = useMemo(() => {
    // ────────────────────────────────────────────────────────
    // 🔥 SINGLE PASS (ULTRA PERFORMANCE)
    // ────────────────────────────────────────────────────────
    let totalReceived = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let totalBilled = 0;

    const revenueByMonth: Record<string, number> = {};

    for (const p of payments) {
      totalBilled += p.amount;

      if (p.status === PAYMENT_STATUS.PAID) {
        totalReceived += p.amount;

        const month =
          p.referenceMonth ??
          p.createdAt?.slice(0, 7) ??
          "";

        if (month) {
          revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
        }
      }

      if (p.status === PAYMENT_STATUS.PENDING) {
        totalPending += p.amount;
      }

      if (p.status === PAYMENT_STATUS.OVERDUE) {
        totalOverdue += p.amount;
      }
    }

    const defaultRate =
      totalBilled > 0
        ? Number(((totalOverdue / totalBilled) * 100).toFixed(1))
        : 0;

    // ── PROPERTIES ──────────────────────────────────────────
    let availableProperties = 0;
    let rentedProperties = 0;

    for (const p of properties) {
      if (p.status === PROPERTY_STATUS.AVAILABLE) availableProperties++;
      if (p.status === PROPERTY_STATUS.RENTED) rentedProperties++;
    }

    const occupancyRate =
      properties.length > 0
        ? Number(((rentedProperties / properties.length) * 100).toFixed(1))
        : 0;

    // ── CONTRACTS ───────────────────────────────────────────
    let activeContracts = 0;
    let draftContracts = 0;

    for (const c of contracts) {
      if (c.status === CONTRACT_STATUS.ACTIVE) activeContracts++;
      if (c.status === CONTRACT_STATUS.DRAFT) draftContracts++;
    }

    // ── TENANTS ─────────────────────────────────────────────
    const tenantsByPlan: Record<string, number> = {};

    for (const t of tenants) {
      const plan = t.plan ?? "BASIC";
      tenantsByPlan[plan] = (tenantsByPlan[plan] || 0) + 1;
    }

    // ── CHART ───────────────────────────────────────────────
    const revenueChart = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, value]) => ({
        month,
        value,
        formatted: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
          notation: "compact",
        }).format(value),
      }));

    // ── RETURN ──────────────────────────────────────────────
    return {
      // Financeiro
      totalReceived,
      totalPending,
      totalOverdue,
      totalBilled,
      defaultRate,

      // Imóveis
      totalProperties: properties.length,
      availableProperties,
      rentedProperties,
      occupancyRate,

      // Contratos
      totalContracts: contracts.length,
      activeContracts,
      draftContracts,

      // Inquilinos
      totalTenants: tenants.length,
      tenantsByPlan,

      // Pagamentos
      totalPayments: payments.length,

      // Gráfico
      revenueChart,
    };
  }, [payments, tenants, contracts, properties]);

  return {
    ...stats,
    isLoading:
      loadingPayments ||
      loadingTenants ||
      loadingContracts ||
      loadingProperties,
  };
};
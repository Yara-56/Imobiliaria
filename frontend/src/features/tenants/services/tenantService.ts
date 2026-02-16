// src/services/tenantService.ts
import type { Tenant } from "@/core/types/tenant";

// Mock de API, depois você pode substituir por Axios ou fetch real
const API_BASE = "/api/tenants";

export const listTenants = async (): Promise<Tenant[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Erro ao buscar inquilinos");
  return response.json();
};

export const createTenant = async (payload: Partial<Tenant>): Promise<Tenant> => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao criar inquilino");
  return response.json();
};
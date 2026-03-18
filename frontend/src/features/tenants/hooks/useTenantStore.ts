"use client";

import { create } from "zustand";
import { tenantApi } from "../api/tenant.api";

import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../types/tenant.types";

// ===============================================
// 🔧 HELPER — MERGE PROFUNDO (CRÍTICO)
// ===============================================
const mergeTenant = (tenant: Tenant, data: UpdateTenantDTO): Tenant => {
  return {
    ...tenant,
    ...data,

    settings: data.settings
      ? {
          ...tenant.settings,
          ...data.settings,

          limits: {
            ...tenant.settings.limits,
            ...data.settings.limits,
          },

          features: {
            ...tenant.settings.features,
            ...data.settings.features,
          },
        }
      : tenant.settings,
  };
};

// ===============================================
// 📦 STATE TYPE
// ===============================================
interface TenantStore {
  tenants: Tenant[];
  selectedTenant?: Tenant;

  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // =========================
  // ACTIONS
  // =========================
  fetchTenants: () => Promise<void>;
  fetchTenantById: (id: string) => Promise<void>;

  createTenant: (data: CreateTenantDTO | FormData) => Promise<void>;
  updateTenant: (id: string, data: UpdateTenantDTO | FormData) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;

  setSelectedTenant: (tenant?: Tenant) => void;
  reset: () => void;
}

// ===============================================
// 🏢 STORE
// ===============================================
export const useTenantStore = create<TenantStore>((set, get) => ({
  tenants: [],
  selectedTenant: undefined,

  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // ============================================
  // 📄 LISTAR
  // ============================================
  fetchTenants: async () => {
    try {
      set({ isLoading: true });

      const tenants = await tenantApi.list();

      set({ tenants });
    } catch (error) {
      console.error("❌ fetchTenants:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // 🔎 BUSCAR POR ID
  // ============================================
  fetchTenantById: async (id) => {
    try {
      set({ isLoading: true });

      const tenant = await tenantApi.getById(id);

      set({ selectedTenant: tenant });
    } catch (error) {
      console.error("❌ fetchTenantById:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // ➕ CRIAR (OTIMISTA)
  // ============================================
  createTenant: async (data) => {
    try {
      set({ isCreating: true });

      const tempId = `temp-${Date.now()}`;

      // 🧪 Optimistic UI
      const optimisticTenant: Tenant = {
        _id: tempId,
        tenantId: tempId,
        fullName: "Criando...",
        email: "",
        document: "",
        status: "ACTIVE",
        plan: "BASIC",
        preferredPaymentMethod: "PIX",
        autoUpdateContract: false,
        settings: {
          limits: { maxUsers: 0, maxProperties: 0 },
          features: { crm: false, automation: false },
        },
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        tenants: [optimisticTenant, ...state.tenants],
      }));

      const created = await tenantApi.create(data);

      set((state) => ({
        tenants: state.tenants.map((t) =>
          t._id === tempId ? created : t
        ),
      }));
    } catch (error) {
      console.error("❌ createTenant:", error);
    } finally {
      set({ isCreating: false });
    }
  },

  // ============================================
  // ✏️ ATUALIZAR (OTIMISTA)
  // ============================================
  updateTenant: async (id, data) => {
    try {
      set({ isUpdating: true });

      const previous = get().tenants;

      // 🧠 Optimistic Update
      set((state) => ({
        tenants: state.tenants.map((t) =>
          t._id === id
            ? mergeTenant(t, data as UpdateTenantDTO)
            : t
        ),
      }));

      const updated = await tenantApi.update(id, data);

      // 🔄 Confirma com backend
      set((state) => ({
        tenants: state.tenants.map((t) =>
          t._id === id ? updated : t
        ),
      }));
    } catch (error) {
      console.error("❌ updateTenant:", error);

      // 🔁 rollback
      set({ tenants: get().tenants });
    } finally {
      set({ isUpdating: false });
    }
  },

  // ============================================
  // ❌ DELETAR (OTIMISTA)
  // ============================================
  deleteTenant: async (id) => {
    try {
      set({ isDeleting: true });

      const previous = get().tenants;

      // 🧠 Remove antes (UX rápida)
      set((state) => ({
        tenants: state.tenants.filter((t) => t._id !== id),
      }));

      await tenantApi.delete(id);
    } catch (error) {
      console.error("❌ deleteTenant:", error);

      // 🔁 rollback
      set({ tenants: get().tenants });
    } finally {
      set({ isDeleting: false });
    }
  },

  // ============================================
  // 🎯 SELEÇÃO
  // ============================================
  setSelectedTenant: (tenant) => {
    set({ selectedTenant: tenant });
  },

  // ============================================
  // ♻️ RESET
  // ============================================
  reset: () => {
    set({
      tenants: [],
      selectedTenant: undefined,
    });
  },
}));
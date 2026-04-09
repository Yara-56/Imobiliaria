"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query.js";

import { tenantApi } from "../api/tenant.api";
import { tenantKeys } from "../keys/tenant.keys";
import { normalizeSettings } from "../mappers/tenant.mapper";
import { tenantMappers, type TenantFormData } from "../utils/form.utils";

import { toaster } from "@/components/ui/toaster.js";

import type {
  Tenant,
  TenantStatus,
  UpdateTenantDTO,
} from "../types/tenant.types";

export const useTenants = (
  id?: string,
  filters: Record<string, any> = {}
) => {
  const queryClient = useQueryClient();

  // ── LISTAGEM ──────────────────────────────────────────────────
  const listQuery = useQuery({
    queryKey: tenantKeys.list(filters),
    queryFn: () => tenantApi.list(filters),
    staleTime: 1000 * 60 * 5,
  });

  // ── DETALHE ───────────────────────────────────────────────────
  const singleQuery = useQuery({
    queryKey: id ? tenantKeys.detail(id) : [],
    queryFn: () => tenantApi.getById(id!),
    enabled: !!id,
  });

  // ── CREATE (Optimistic UI) ────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (data: TenantFormData) => {
      const payload = tenantMappers.toPayload(data);
      return tenantApi.create(payload);
    },

    onMutate: async (newTenantData: TenantFormData) => {
      await queryClient.cancelQueries({ queryKey: tenantKeys.lists() });

      const previous = queryClient.getQueryData<Tenant[]>(
        tenantKeys.list(filters)
      );

      const now = Date.now();
      const payload = tenantMappers.toPayload(newTenantData);

      const optimisticTenant: Tenant = {
        _id: `temp-${now}`,
        tenantId: `temp-${now}`,
        fullName: payload.fullName,
        email: payload.email,
        document: payload.document,
        phone: payload.phone,
        rentValue: payload.rentValue,
        billingDay: payload.billingDay,
        autoUpdateContract: payload.autoUpdateContract ?? false,
        status: "ACTIVE" as TenantStatus, 
        plan: payload.plan || "BASIC",
        preferredPaymentMethod: payload.preferredPaymentMethod || "PIX",
        createdAt: new Date().toISOString(),
        settings: normalizeSettings(payload.settings),
      };

      queryClient.setQueryData<Tenant[]>(
        tenantKeys.list(filters),
        (old = []) => [optimisticTenant, ...old]
      );

      return { previous };
    },

    onError: (err: any, _data, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tenantKeys.list(filters), ctx.previous);
      }

      toaster.create({
        title: "Erro ao criar",
        description: err?.response?.data?.message || "Falha ao cadastrar",
        type: "error",
      });
    },

    onSuccess: (created) => {
      queryClient.setQueryData<Tenant[]>(
        tenantKeys.list(filters),
        (old = []) => old.map((t) => (t._id.startsWith("temp-") ? created : t))
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });

  // ── UPDATE ────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTenantDTO; // ✅ Mudou aqui: usar UpdateTenantDTO ao invés de TenantFormData
    }) => {
      return tenantApi.update(id, data);
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: tenantKeys.list(filters) });

      const previous = queryClient.getQueryData<Tenant[]>(
        tenantKeys.list(filters)
      );

      // ✅ Não incluir campos de arquivo no update otimista
      const { profilePhoto, documents, ...updateData } = data;

      queryClient.setQueryData<Tenant[]>(
        tenantKeys.list(filters),
        (old = []) =>
          old.map((t) =>
            t._id === id
              ? {
                  ...t,
                  ...updateData,
                  settings: updateData.settings 
                    ? normalizeSettings(updateData.settings) 
                    : t.settings,
                }
              : t
          )
      );

      return { previous };
    },

    onError: (_err, _data, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tenantKeys.list(filters), ctx.previous);
      }

      toaster.create({
        title: "Erro ao atualizar",
        type: "error",
      });
    },

    onSuccess: (updated) => {
      queryClient.setQueryData(tenantKeys.detail(updated._id), updated);
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });

  // ── DELETE ────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: tenantKeys.list(filters) });

      const previous = queryClient.getQueryData<Tenant[]>(
        tenantKeys.list(filters)
      );

      queryClient.setQueryData<Tenant[]>(
        tenantKeys.list(filters),
        (old = []) => old.filter((t) => t._id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tenantKeys.list(filters), ctx.previous);
      }

      toaster.create({
        title: "Erro ao remover",
        type: "error",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });

  // ── RETURN ────────────────────────────────────────────────────
  return {
    tenants: listQuery.data ?? [],
    tenant: singleQuery.data,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,

    actions: {
      create: createMutation.mutateAsync,
      quickAdd: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      remove: deleteMutation.mutateAsync,
      refetch: listQuery.refetch,
    },

    mutations: {
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
    }
  };
};
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query.js";
import { tenantApi } from "../api/tenant.api";
import type { CreateTenantDTO, UpdateTenantDTO, Tenant } from "../types/tenant.types";
import { toaster } from "@/components/ui/toaster.js";

interface UpdateParams {
  id: string;
  data: UpdateTenantDTO | FormData;
}

export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();

  /**
   * ===============================
   * 🔎 QUERY — Lista ou busca por ID
   * ===============================
   */
  const listQuery = useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: () => tenantApi.list(),
    staleTime: 1000 * 60 * 5,
    enabled: !id,
  });

  const singleQuery = useQuery<Tenant, Error>({
    queryKey: ["tenants", id],
    queryFn: () => tenantApi.getById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  /**
   * ===============================
   * 🚀 CREATE
   * ===============================
   */
  const createMutation = useMutation<Tenant, Error, CreateTenantDTO | FormData>({
    mutationFn: (data) => tenantApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toaster.create({
        title: "Inquilino cadastrado",
        description: "Novo inquilino adicionado com sucesso.",
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Erro ao cadastrar",
        description: error?.response?.data?.message || "Falha ao criar inquilino.",
        type: "error",
      });
    },
  });

  /**
   * ===============================
   * ✏️ UPDATE
   * ===============================
   */
  const updateMutation = useMutation<Tenant, Error, UpdateParams>({
    mutationFn: ({ id, data }) => tenantApi.update(id, data),

    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.setQueryData(["tenants", updated._id], updated);
      toaster.create({
        title: "Inquilino atualizado",
        description: `Dados de ${updated.fullName} atualizados.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Erro ao atualizar",
        description: error?.response?.data?.message || "Falha na atualização.",
        type: "error",
      });
    },
  });

  /**
   * ===============================
   * 📦 RETURN
   * ===============================
   */
  return {
    tenant: singleQuery.data,
    tenants: listQuery.data ?? [],

    isLoading: listQuery.isLoading || singleQuery.isLoading,
    isError: listQuery.isError || singleQuery.isError,

    createTenant: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTenant: updateMutation.mutate,
    isUpdating: updateMutation.isPending,

    // Compatibilidade com useTenants antigo
    actions: {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
    },
    status: {
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isLoading: listQuery.isLoading,
      isError: listQuery.isError,
    },
  };
};
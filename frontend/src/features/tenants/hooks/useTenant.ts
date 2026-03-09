"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js";
import {
  CreateTenantDTO,
  UpdateTenantDTO,
  Tenant,
} from "../types/tenant.enums.js";
import { toaster } from "@/components/ui/toaster";

interface UpdateParams {
  id: string;
  data: UpdateTenantDTO | FormData;
}

export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();

  /**
   * ===============================
   * 🔎 QUERY
   * ===============================
   */

  const {
    data,
    isLoading,
    isError,
  } = useQuery<Tenant | Tenant[], Error>({
    queryKey: id ? ["tenants", id] : ["tenants"],
    queryFn: () => {
      if (id) {
        return tenantApi.getById(id);
      }
      return tenantApi.list();
    },
    staleTime: 1000 * 60 * 5,
  });

  /**
   * ===============================
   * 🚀 CREATE
   * ===============================
   */

  const createMutation = useMutation({
    mutationFn: (data: CreateTenantDTO | FormData) => {
      return tenantApi.create(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      toaster.create({
        title: "Tenant criado",
        description: "Novo tenant provisionado com sucesso.",
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Erro ao criar tenant",
        description:
          error?.response?.data?.message || "Falha ao criar tenant.",
        type: "error",
      });
    },
  });

  /**
   * ===============================
   * ✏️ UPDATE
   * ===============================
   */

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateParams) => {
      return tenantApi.update(id, data);
    },

    onSuccess: (updated: Tenant) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      queryClient.setQueryData(["tenants", updated._id], updated);

      toaster.create({
        title: "Tenant atualizado",
        description: `Dados de ${updated.fullName} atualizados.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Erro ao atualizar",
        description:
          error?.response?.data?.message || "Falha na atualização.",
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
    tenant: id ? (data as Tenant | undefined) : undefined,
    tenants: !id ? (data as Tenant[] | undefined) : undefined,

    isLoading,
    isError,

    createTenant: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTenant: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
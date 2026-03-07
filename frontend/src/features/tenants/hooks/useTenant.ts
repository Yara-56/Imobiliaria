"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js"; // ✅ Extensão .js para NodeNext
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
   * 🔍 1. BUSCA (Read)
   * ✅ Resolvendo erro de sobrecarga: Definimos explicitamente o tipo do Query
   * para aceitar tanto Tenant[] quanto Tenant ou undefined.
   */
  const {
    data: tenantData,
    isLoading: isFetching,
    isError,
  } = useQuery<any, Error>({
    queryKey: id ? ["tenants", id] : ["tenants"],
    queryFn: async () => {
      if (id) return tenantApi.getById(id);
      return tenantApi.list();
    },
    // Mantém o cache por 5 minutos para performance no seu MacBook
    staleTime: 1000 * 60 * 5,
  });

  // 🚀 2. CRIAÇÃO (Create)
  const createMutation = useMutation({
    mutationFn: (data: FormData | CreateTenantDTO) => tenantApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toaster.create({
        title: "Provisionamento Concluído",
        description: "Nova instância ativa no cluster.",
        type: "success",
      });
    },
  });

  // 📝 3. ATUALIZAÇÃO (Update)
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: UpdateParams) => {
      return tenantApi.update(id, data);
    },
    onSuccess: (updated) => {
      // ✅ Invalidação inteligente do cache
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.setQueryData(["tenants", updated._id], updated);

      toaster.create({
        title: "Cluster Sincronizado",
        description: `As configurações de ${updated.fullName} foram aplicadas.`,
        type: "success",
      });
    },
    onError: (error: any) => {
      toaster.create({
        title: "Erro de Sincronização",
        description:
          error.response?.data?.message || "Falha ao conectar com o nó.",
        type: "error",
      });
    },
  });

  return {
    // Retornos tipados para as páginas de New e Edit
    tenant: id ? (tenantData as Tenant) : null,
    tenants: !id ? (tenantData as Tenant[]) : [],

    isLoading: isFetching,
    isError,

    createTenant: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTenant: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

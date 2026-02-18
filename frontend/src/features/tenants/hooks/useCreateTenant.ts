"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api";
import { UpdateTenantDTO, Tenant } from "../types/tenant"; 
import { toaster } from "@/components/ui/toaster";

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, { id: string; data: UpdateTenantDTO }>({
    mutationFn: async ({ id, data }) => {
      return tenantApi.update(id, data);
    },

    onSuccess: (updatedTenant) => {
      // ✅ Invalida a lista para atualizar tabelas
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      
      // ✅ Atualiza o cache individual usando o _id que você definiu na interface
      queryClient.setQueryData(["tenants", updatedTenant._id], updatedTenant);

      toaster.create({
        title: "Sincronização Concluída",
        description: `As configurações de ${updatedTenant.name} foram aplicadas com sucesso.`,
        type: "success",
      });
    },

    onError: (error) => {
      toaster.create({
        title: "Falha na Atualização",
        description: error.message || "Erro ao conectar com o cluster.",
        type: "error",
      });
    },
  });
};
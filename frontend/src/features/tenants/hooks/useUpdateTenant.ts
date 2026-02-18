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
      // ✅ Invalida a lista para garantir que todos os componentes vejam a mudança
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      
      // ✅ CORREÇÃO: Usando _id conforme definido na sua interface Tenant
      queryClient.setQueryData(["tenants", updatedTenant._id], updatedTenant);

      toaster.create({
        title: "Sincronização Concluída",
        description: `As configurações de ${updatedTenant.name} foram aplicadas.`,
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
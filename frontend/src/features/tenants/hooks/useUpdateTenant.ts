"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js"; // ✅ Extensão .js para padrão NodeNext
import { UpdateTenantDTO, Tenant } from "../types/tenant.enums.js";
import { toaster } from "@/components/ui/toaster";

/**
 * 🛡️ Interface de Parâmetros da Mutação
 * Permite que o hook aceite tanto o DTO (JSON) quanto FormData (Arquivos).
 * Isso resolve o erro ts(2559) na sua EditTenantPage.
 */
interface UpdateParams {
  id: string;
  data: UpdateTenantDTO | FormData;
}

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, UpdateParams>({
    mutationFn: async ({ id, data }) => {
      return tenantApi.update(id, data);
    },

    onSuccess: (updatedTenant) => {
      // ✅ Invalida a lista para garantir que todos os componentes vejam a mudança
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      // ✅ Atualiza o cache individual usando o _id do MongoDB
      queryClient.setQueryData(["tenants", updatedTenant._id], updatedTenant);

      toaster.create({
        title: "Sincronização Concluída",
        /**
         * 🛡️ CORREÇÃO ts(2339):
         * Usando 'fullName' conforme definido na sua interface Tenant master.
         */
        description: `As configurações de ${updatedTenant.fullName} foram aplicadas.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Falha na Atualização",
        description:
          error.response?.data?.message || "Erro ao conectar com o cluster.",
        type: "error",
      });
    },
  });
};

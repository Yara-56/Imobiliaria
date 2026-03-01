"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api"; 
import { CreateTenantDTO, Tenant } from "../types/tenant"; 
import { toaster } from "@/components/ui/toaster";

/**
 * 🚀 Hook para Criação de Inquilinos
 * Aceita CreateTenantDTO (JSON) ou FormData (Upload de arquivos).
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, CreateTenantDTO | FormData>({
    mutationFn: async (data) => {
      // O tenantApi.create deve estar exportado corretamente no seu .api
      return tenantApi.create(data);
    },

    onSuccess: (newTenant) => {
      // ✅ Atualiza a lista de inquilinos automaticamente
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      
      toaster.create({
        title: "Cadastro Realizado!",
        /**
         * 🛡️ CORREÇÃO ts(2339): 
         * Usando fullName e garantindo que o TypeScript entenda o retorno.
         */
        description: `O inquilino ${newTenant.fullName} foi adicionado com sucesso.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      // 🛡️ Captura a mensagem vinda do seu Backend (Express/Nest)
      const errorMessage = error.response?.data?.message || "Erro ao conectar com o servidor.";
      
      toaster.create({
        title: "Falha no Cadastro",
        description: errorMessage,
        type: "error",
      });
      
      console.error("Erro na mutação:", error);
    },
  });
};
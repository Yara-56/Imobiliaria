"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js"; // ✅ .js para padrão NodeNext
import { CreateTenantDTO, Tenant } from "../types/tenant.js"; 
import { toaster } from "@/components/ui/toaster";

/**
 * 🚀 Hook para Criação de Inquilinos
 * Suporta tanto o DTO (JSON) quanto FormData (Arquivos binários).
 * Isso resolve o erro de incompatibilidade ts(2559).
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, CreateTenantDTO | FormData>({
    mutationFn: async (data) => {
      // 🛡️ O tenantApi.create já está preparado para tratar o FormData
      return tenantApi.create(data);
    },

    onSuccess: (newTenant) => {
      // ✅ Invalida a lista para que o novo inquilino apareça na tabela
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      
      toaster.create({
        title: "Provisionamento Concluído",
        /**
         * 🛡️ CORREÇÃO ts(2339): 
         * Usando 'fullName' conforme definido na sua interface Tenant master.
         */
        description: `A instância de ${newTenant.fullName} está ativa no cluster Aura.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      toaster.create({
        title: "Erro de Infraestrutura",
        description: error.response?.data?.message || "Falha ao sincronizar com o banco de dados.",
        type: "error",
      });
    },
  });
};
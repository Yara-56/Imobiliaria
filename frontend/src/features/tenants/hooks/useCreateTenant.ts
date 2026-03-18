"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api";
import type { CreateTenantDTO, Tenant } from "../types/tenant.types";
import { toaster } from "@/components/ui/toaster";

/**
 * 🚀 Hook para criação de locatários
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, CreateTenantDTO>({
    mutationFn: async (data) => {
      return tenantApi.create(data);
    },

    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      toaster.create({
        title: "Cadastro realizado!",
        description: `O inquilino ${newTenant.fullName} foi adicionado com sucesso.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ?? "Erro ao conectar com o servidor.";

      toaster.create({
        title: "Erro no cadastro",
        description: errorMessage,
        type: "error",
      });

      console.error("Erro ao criar tenant:", error);
    },
  });
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenant } from "../services/tenantService";
import { Tenant } from "../types/tenant";
import { toaster } from "@/components/ui/toaster";

/**
 * Hook especializado para a criação de novos inquilinos (Tenants).
 * Separa a lógica de mutação da listagem geral para maior performance e clareza.
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Partial<Tenant>) => createTenant(data),
    
    // Antes de executar a função (opcional: pode ser usado para logs ou analytics)
    onMutate: async (newTenant) => {
      console.log("Iniciando provisionamento para:", newTenant.name);
    },

    onSuccess: (data) => {
      // 1. Invalida o cache da lista para garantir que o novo apareça
      queryClient.invalidateQueries({ queryKey: ["tenants"] });

      // 2. Feedback visual profissional
      toaster.create({
        title: "Provisionamento Concluído",
        description: `A instância para ${data.name} foi criada com sucesso na porta 3001.`,
        type: "success",
      });
    },

    onError: (error: any) => {
      // Tratamento de erro detalhado vindo do backend
      const errorMessage = error.response?.data?.message || "Erro ao conectar com o servidor.";
      
      toaster.create({
        title: "Falha no Cadastro",
        description: errorMessage,
        type: "error",
      });
    },
  });

  return {
    createTenant: mutation.mutate,
    createTenantAsync: mutation.mutateAsync, // Útil para fluxos onde você precisa do await no componente
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
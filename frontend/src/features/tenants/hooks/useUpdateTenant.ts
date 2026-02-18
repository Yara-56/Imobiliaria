import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/core/api/api";
import { Tenant } from "../types/tenant";
import { toaster } from "@/components/ui/toaster";

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tenant> }) => {
      const response = await api.patch(`/tenants/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedTenant) => {
      // Atualiza o cache da lista e do tenant específico
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", updatedTenant._id] });
      
      toaster.create({
        title: "Atualizado!",
        description: "As configurações da instância foram salvas.",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({ title: "Erro ao atualizar", type: "error" });
    }
  });
};
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/core/api/api";
import { Tenant } from "../types/tenant";
import { toaster } from "@/components/ui/toaster";

export const useTenants = (tenantId?: string) => {
  const queryClient = useQueryClient();

  // --- 1. BUSCA DE TODOS OS INQUILINOS ---
  const tenantsQuery = useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: async () => {
      const { data } = await api.get("/tenants");
      // Mapeia tanto data.data (padrão API) quanto data (fallback)
      return data.data || data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache "fresco"
  });

  // --- 2. BUSCA DE UM INQUILINO ESPECÍFICO (Para Edição/Detalhes) ---
  const singleTenantQuery = useQuery<Tenant, Error>({
    queryKey: ["tenants", tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/tenants/${tenantId}`);
      return data.data || data;
    },
    enabled: !!tenantId, // Só dispara se houver ID
  });

  // --- 3. MUTACÃO: ADICIONAR ---
  const addTenantMutation = useMutation({
    mutationFn: async (newTenant: Partial<Tenant>) => {
      const { data } = await api.post("/tenants", newTenant);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toaster.create({ 
        title: "Sucesso!", 
        description: "Nova imobiliária provisionada no ecossistema.", 
        type: "success" 
      });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Erro ao cadastrar", 
        description: error.response?.data?.message || "Erro na rede.", 
        type: "error" 
      });
    }
  });

  // --- 4. MUTACÃO: ATUALIZAR ---
  const updateTenantMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tenant> }) => {
      const response = await api.put(`/tenants/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenants", variables.id] });
      toaster.create({ title: "Dados atualizados!", type: "success" });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Falha na atualização", 
        description: error.response?.data?.message, 
        type: "error" 
      });
    }
  });

  // --- 5. MUTACÃO: REMOVER ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tenants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toaster.create({ title: "Instância removida", type: "success" });
    },
    onError: (error: any) => {
      toaster.create({ 
        title: "Erro ao remover", 
        description: error.response?.data?.message || "Não foi possível excluir.", 
        type: "error" 
      });
    }
  });

  return {
    // Dados
    tenants: tenantsQuery.data ?? [],
    tenant: singleTenantQuery.data,
    
    // Estados de Queries (Resolvendo o erro ts(2339) da sua página)
    isLoading: tenantsQuery.isLoading || singleTenantQuery.isLoading,
    isFetching: tenantsQuery.isFetching, // ✅ Agora disponível para o seu botão de refresh
    isError: tenantsQuery.isError,
    refetch: tenantsQuery.refetch,

    // Ações de Adição
    addTenant: addTenantMutation.mutate,
    addTenantAsync: addTenantMutation.mutateAsync,
    isAdding: addTenantMutation.isPending,

    // Ações de Edição
    updateTenant: updateTenantMutation.mutate,
    updateTenantAsync: updateTenantMutation.mutateAsync,
    isUpdating: updateTenantMutation.isPending,

    // Ações de Deleção
    deleteTenant: deleteMutation.mutate,
    deleteTenantAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  };
};
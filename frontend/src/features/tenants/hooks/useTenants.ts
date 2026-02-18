"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js"; // ✅ Extensão .js para NodeNext
import { toaster } from "@/components/ui/toaster";
import type { Tenant, CreateTenantDTO, UpdateTenantDTO } from "../types/tenant.js";

/**
 * 🛡️ Interface de Parâmetros para Mutação
 * Resolve o erro ts(2559) ao permitir que 'data' seja FormData ou DTO.
 */
interface UpdateMutationParams {
  id: string;
  data: UpdateTenantDTO | FormData; 
}

export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();
  const KEY = ["tenants"] as const;

  // --- QUERIES (BUSCA) ---
  const listQuery = useQuery<Tenant[], Error>({
    queryKey: KEY,
    queryFn: tenantApi.list,
    staleTime: 1000 * 60 * 5, // 5 min de cache "quente"
  });

  const singleQuery = useQuery<Tenant, Error>({
    queryKey: [...KEY, id],
    queryFn: () => tenantApi.getById(id!), // ✅ Nome corrigido para getById
    enabled: !!id,
  });

  // --- MUTATIONS (AÇÕES NO BANCO) ---

  const createTenant = useMutation<Tenant, Error, CreateTenantDTO | FormData>({
    mutationFn: (data) => tenantApi.create(data),
    onSuccess: (newTenant) => {
      queryClient.setQueryData<Tenant[]>(KEY, (old) => old ? [...old, newTenant] : [newTenant]);
      toaster.create({ title: "Node Provisionado", type: "success" });
    },
  });

  const updateTenant = useMutation<Tenant, Error, UpdateMutationParams>({
    mutationFn: ({ id, data }) => tenantApi.update(id, data), // ✅ Agora aceita FormData
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: KEY });
      queryClient.setQueryData([...KEY, updated._id], updated);
      toaster.create({ title: "Cluster Sincronizado", type: "success" });
    },
  });

  const removeTenant = useMutation<void, Error, string>({
    mutationFn: tenantApi.delete,
    onSuccess: (_, deletedId) => {
      // ✅ OPTIMISTIC UI: Remove da lista instantaneamente no cache
      queryClient.setQueryData<Tenant[]>(KEY, (old) => 
        old?.filter((t) => t._id !== deletedId)
      );
      toaster.create({ title: "Instância Removida", type: "info" });
    },
    onError: (error) => {
      toaster.create({ title: "Falha na Remoção", description: error.message, type: "error" });
    }
  });

  return {
    // Dados
    tenants: listQuery.data ?? [],
    tenant: singleQuery.data,
    
    // Estados Globais
    isLoading: listQuery.isLoading || (!!id && singleQuery.isLoading),
    isError: listQuery.isError || singleQuery.isError,
    isFetching: listQuery.isFetching,

    // Funções de Ação (Acessíveis na Page)
    createTenant: createTenant.mutateAsync,
    updateTenant: updateTenant.mutateAsync,
    removeTenant: removeTenant.mutateAsync,

    // Status das Ações
    isCreating: createTenant.isPending,
    isUpdating: updateTenant.isPending,
    isRemoving: removeTenant.isPending,
  };
};
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js";
import { toaster } from "@/components/ui/toaster";

import type { 
  Tenant, 
  CreateTenantDTO, 
  UpdateTenantDTO 
} from "../types/tenant.enums.js";

/**
 * Hook profissional para gestão de Inquilinos (Tenants)
 * - Cache inteligente
 * - UI otimista (UX instantânea)
 * - Preparado para escala SaaS
 */
export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();
  const TENANTS_KEY = ["tenants"] as const;

  // ================================
  // 📦 LISTAGEM
  // ================================
  const listQuery = useQuery({
    queryKey: TENANTS_KEY,
    queryFn: tenantApi.list,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // ================================
  // 🔍 BUSCA UNITÁRIA
  // ================================
  const singleQuery = useQuery({
    queryKey: [...TENANTS_KEY, id],
    queryFn: () => tenantApi.getById(id!),
    enabled: !!id,
  });

  // ================================
  // 🧠 CRIAÇÃO (COM UI OTIMISTA)
  // ================================
  const createMutation = useMutation({
    mutationFn: async (data: CreateTenantDTO | FormData) => {
      const payload = data instanceof FormData 
        ? Object.fromEntries(data.entries()) 
        : data;

      return tenantApi.create(payload as CreateTenantDTO);
    },

    // ⚡ Antes da API responder
    onMutate: async (newTenant) => {
      await queryClient.cancelQueries({ queryKey: TENANTS_KEY });

      const previous = queryClient.getQueryData<Tenant[]>(TENANTS_KEY);

      // 🧪 Criação otimista
      const optimisticTenant: Tenant = {
        _id: `temp-${Date.now()}`,
        ...(newTenant as CreateTenantDTO),
        status: (newTenant as any)?.status || "lead",
        createdAt: new Date().toISOString()
      } as Tenant;

      queryClient.setQueryData<Tenant[]>(TENANTS_KEY, (old = []) => [
        optimisticTenant,
        ...old
      ]);

      return { previous };
    },

    // ❌ rollback
    onError: (error: any, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TENANTS_KEY, context.previous);
      }

      const message = error.response?.data?.message || "Erro ao criar inquilino.";

      toaster.create({
        title: "Falha no cadastro",
        description: message,
        type: "error",
      });
    },

    // ✅ sucesso real
    onSuccess: (created) => {
      queryClient.setQueryData<Tenant[]>(TENANTS_KEY, (old = []) =>
        old.map((t) =>
          t._id.startsWith("temp-") ? created : t
        )
      );

      toaster.create({
        title: "Inquilino cadastrado",
        description: "Criado com sucesso.",
        type: "success",
      });
    }
  });

  // ================================
  // ✏️ ATUALIZAÇÃO
  // ================================
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDTO | FormData }) => {
      const payload = data instanceof FormData 
        ? Object.fromEntries(data.entries()) 
        : data;

      return tenantApi.update(id, payload as UpdateTenantDTO);
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TENANTS_KEY });

      const previous = queryClient.getQueryData<Tenant[]>(TENANTS_KEY);

      queryClient.setQueryData<Tenant[]>(TENANTS_KEY, (old = []) =>
        old.map((tenant) =>
          tenant._id === id
            ? { ...tenant, ...(data as UpdateTenantDTO) }
            : tenant
        )
      );

      return { previous };
    },

    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TENANTS_KEY, context.previous);
      }

      toaster.create({
        title: "Erro ao atualizar",
        type: "error",
      });
    },

    onSuccess: (updated) => {
      queryClient.setQueryData([...TENANTS_KEY, updated._id], updated);

      toaster.create({
        title: "Dados atualizados",
        type: "success",
      });
    }
  });

  // ================================
  // 🗑️ REMOÇÃO (UI OTIMISTA)
  // ================================
  const deleteMutation = useMutation({
    mutationFn: tenantApi.delete,

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: TENANTS_KEY });

      const previous = queryClient.getQueryData<Tenant[]>(TENANTS_KEY);

      queryClient.setQueryData<Tenant[]>(TENANTS_KEY, (old = []) =>
        old.filter((t) => t._id !== deletedId)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TENANTS_KEY, context.previous);
      }

      toaster.create({
        title: "Erro ao remover",
        type: "error",
      });
    },

    onSuccess: () => {
      toaster.create({
        title: "Inquilino removido",
        type: "success",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
    }
  });

  // ================================
  // 📤 RETORNO PADRONIZADO
  // ================================
  return {
    // 📊 Dados
    tenants: listQuery.data ?? [],
    tenant: singleQuery.data,

    // 📡 Estados globais
    status: {
      isLoading: listQuery.isLoading,
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isRemoving: deleteMutation.isPending,
      isError: listQuery.isError || singleQuery.isError
    },

    // ⚙️ Ações
    actions: {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      remove: deleteMutation.mutateAsync
    }
  };
};
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
 * Implementa Cache Dinâmico, UI Otimista e Transformação de Dados.
 */
export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();
  const TENANTS_KEY = ["tenants"] as const;

  // --- LISTAGEM ---
  const listQuery = useQuery({
    queryKey: TENANTS_KEY,
    queryFn: tenantApi.list,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache "fresco"
  });

  // --- BUSCA UNITÁRIA ---
  const singleQuery = useQuery({
    queryKey: [...TENANTS_KEY, id],
    queryFn: () => tenantApi.getById(id!),
    enabled: !!id,
  });

  // --- CRIAÇÃO (COM TRANSFORMAÇÃO DE PAYLOAD) ---
  const createMutation = useMutation({
    mutationFn: async (data: CreateTenantDTO | FormData) => {
      // Resolve o erro 400: Converte FormData para JSON se necessário
      const payload = data instanceof FormData 
        ? Object.fromEntries(data.entries()) 
        : data;
      
      return tenantApi.create(payload as CreateTenantDTO);
    },
    onSuccess: () => {
      // Invalida o cache para forçar atualização da lista
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      toaster.create({
        title: "Inquilino cadastrado",
        description: "Os dados foram salvos com sucesso.",
        type: "success",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Erro ao conectar com o servidor.";
      toaster.create({
        title: "Falha no cadastro",
        description: message,
        type: "error",
      });
    }
  });

  // --- ATUALIZAÇÃO ---
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDTO | FormData }) => {
      const payload = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
      return tenantApi.update(id, payload as UpdateTenantDTO);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.setQueryData([...TENANTS_KEY, updated._id], updated);
      toaster.create({ title: "Dados atualizados", type: "success" });
    }
  });

  // --- REMOÇÃO (UI OTIMISTA) ---
  const deleteMutation = useMutation({
    mutationFn: tenantApi.delete,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: TENANTS_KEY });
      const previousTenants = queryClient.getQueryData<Tenant[]>(TENANTS_KEY);

      queryClient.setQueryData<Tenant[]>(TENANTS_KEY, (old) =>
        old?.filter((t) => t._id !== deletedId)
      );

      return { previousTenants };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTenants) {
        queryClient.setQueryData(TENANTS_KEY, context.previousTenants);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
    }
  });

  return {
    // Dados normalizados
    tenants: listQuery.data ?? [],
    tenant: singleQuery.data,
    
    // Estados de Loading (Escalável para Spinners globais ou locais)
    status: {
      isLoading: listQuery.isLoading,
      isCreating: createMutation.isPending,
      isUpdating: updateMutation.isPending,
      isRemoving: deleteMutation.isPending,
      isError: listQuery.isError || singleQuery.isError
    },

    // Ações expostas
    actions: {
      create: createMutation.mutateAsync,
      update: updateMutation.mutateAsync,
      remove: deleteMutation.mutateAsync
    }
  };
};
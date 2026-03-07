"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from "../api/tenant.api.js";
import type {
  Tenant,
  CreateTenantDTO,
  UpdateTenantDTO,
} from "../types/tenant.enums.js";
import { toaster } from "@/components/ui/toaster";

interface UpdateParams {
  id: string;
  data: UpdateTenantDTO | FormData;
}

interface DeleteContext {
  previous?: Tenant[];
}

export const useTenants = (id?: string) => {
  const queryClient = useQueryClient();
  const BASE_KEY = ["tenants"] as const;

  // ======================
  // LISTAGEM
  // ======================
  const listQuery = useQuery<Tenant[], Error>({
    queryKey: BASE_KEY,
    queryFn: tenantApi.list,
    staleTime: 1000 * 60 * 5,
  });

  // ======================
  // BUSCA POR ID
  // ======================
  const singleQuery = useQuery<Tenant, Error>({
    queryKey: [...BASE_KEY, id],
    queryFn: () => tenantApi.getById(id!),
    enabled: !!id,
  });

  // ======================
  // CREATE
  // ======================
  const createMutation = useMutation<Tenant, Error, CreateTenantDTO | FormData>(
    {
      mutationFn: tenantApi.create,
      onSuccess: (newTenant) => {
        queryClient.setQueryData<Tenant[]>(BASE_KEY, (old) =>
          old ? [...old, newTenant] : [newTenant]
        );

        toaster.create({
          title: "Tenant criado com sucesso",
          type: "success",
        });
      },
    }
  );

  // ======================
  // UPDATE
  // ======================
  const updateMutation = useMutation<Tenant, Error, UpdateParams>({
    mutationFn: ({ id, data }) => tenantApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData<Tenant[]>(BASE_KEY, (old) =>
        old?.map((t) => (t._id === updated._id ? updated : t))
      );

      queryClient.setQueryData([...BASE_KEY, updated._id], updated);

      toaster.create({
        title: "Tenant atualizado com sucesso",
        type: "success",
      });
    },
  });

  // ======================
  // DELETE (Optimistic UI)
  // ======================
  const deleteMutation = useMutation<void, Error, string, DeleteContext>({
    mutationFn: tenantApi.delete,

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: BASE_KEY });

      const previous = queryClient.getQueryData<Tenant[]>(BASE_KEY);

      queryClient.setQueryData<Tenant[]>(BASE_KEY, (old) =>
        old?.filter((t) => t._id !== deletedId)
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BASE_KEY, context.previous);
      }

      toaster.create({
        title: "Erro ao remover tenant",
        type: "error",
      });
    },

    onSuccess: () => {
      toaster.create({
        title: "Tenant removido com sucesso",
        type: "info",
      });
    },
  });

  return {
    // Dados
    tenants: listQuery.data ?? [],
    tenant: singleQuery.data,

    // Estados
    isLoading: listQuery.isLoading || (!!id && singleQuery.isLoading),
    isError: listQuery.isError || singleQuery.isError,
    isFetching: listQuery.isFetching,

    // Ações
    createTenant: createMutation.mutateAsync,
    updateTenant: updateMutation.mutateAsync,
    removeTenant: deleteMutation.mutateAsync,

    // Status das ações
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: deleteMutation.isPending,
  };
};

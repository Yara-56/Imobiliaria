import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTenants, createTenant } from "../services/tenantService";
import type { Tenant } from "../types/tenant";

export const useTenants = () => {
  const queryClient = useQueryClient();

  const tenantsQuery = useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: listTenants,
    staleTime: 1000 * 60 * 5,
  });

  const addTenantMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      // ✅ Invalida o cache para atualizar a lista na hora
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  return {
    tenants: tenantsQuery.data ?? [],
    isLoading: tenantsQuery.isLoading,
    isError: tenantsQuery.isError,
    addTenant: addTenantMutation.mutate,
    isAdding: addTenantMutation.isPending,
  };
};
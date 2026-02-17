import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTenants, createTenant, updateTenant } from "../services/tenantService";
import type { Tenant } from "../types/tenant";

export const useTenants = () => {
  const queryClient = useQueryClient();

  const tenantsQuery = useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: listTenants,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  const addTenantMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  const updateTenantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) => 
      updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });

  return {
    tenants: tenantsQuery.data ?? [],
    isLoading: tenantsQuery.isLoading,
    isError: tenantsQuery.isError,
    isFetching: tenantsQuery.isFetching, // ✅ Resolve o erro ts(2339)
    refetch: tenantsQuery.refetch,
    addTenant: addTenantMutation.mutate,
    isAdding: addTenantMutation.isPending,
    updateTenant: updateTenantMutation.mutate,
    isUpdating: updateTenantMutation.isPending,
  };
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTenants, createTenant } from "@/services/tenantService";
import type { Tenant } from "../types";

export const useTenants = () => {
  const queryClient = useQueryClient();

  // ✅ Hook para listar inquilinos
  const tenantsQuery = useQuery<Tenant[], Error>({
    queryKey: ["tenants"],
    queryFn: listTenants,
    staleTimeMilliseconds: 1000 * 60 * 5, // 5 minutos
    cacheTimeMilliseconds: 1000 * 60 * 30, // 30 minutos
  });

  // ✅ Hook para criar um inquilino
  const addTenantMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: (newTenant) => {
      queryClient.setQueryData<Tenant[]>(["tenants"], (old?: Tenant[]) => {
        return old ? [newTenant, ...old] : [newTenant];
      });
    },
  });

  return { tenantsQuery, addTenantMutation };
};
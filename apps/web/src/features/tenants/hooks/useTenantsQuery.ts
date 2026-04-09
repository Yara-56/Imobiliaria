import { useQuery } from "@tanstack/react-query.js";
import { tenantApi } from "../api/tenant.api";
import { useTenantStore } from "../store/useTenantStore";

export const TENANTS_QUERY_KEY = ["tenants"];

export const useTenantsQuery = () => {
  const setTenants = useTenantStore((s) => s.setTenants);

  return useQuery({
    queryKey: TENANTS_QUERY_KEY,
    queryFn: tenantApi.list,

    staleTime: 1000 * 60 * 5,

    onSuccess: (data) => {
      // 🔥 sincroniza com Zustand
      setTenants(data);
    },
  });
};
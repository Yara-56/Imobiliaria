import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../api/payment.api.js";
import { useTenants } from "../../tenants/hooks/useTenants.js";

export function usePayments() {
  const queryClient = useQueryClient();
  const { tenants } = useTenants();

  const query = useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.list,
  });

  const createMutation = useMutation({
    mutationFn: paymentApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => paymentApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });

  return {
    payments: query.data ?? [],
    tenants,
    isLoading: query.isLoading,
    createPayment: createMutation.mutateAsync,
    updatePayment: updateMutation.mutateAsync,
    deletePayment: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    refetch: query.refetch
  };
}
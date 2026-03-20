import { useQuery, useMutation, useQueryClient, QueryObserverResult } from "@tanstack/react-query";
import { paymentApi } from "../api/payment.api";
import { CreatePaymentDTO, Payment, Tenant, Contract } from "../types/payment.types";

interface UsePaymentsReturn {
  payments: Payment[];
  tenants: Tenant[];
  contracts: Contract[];
  isLoading: boolean;
  refetch: () => Promise<QueryObserverResult<Payment[], Error>>;
  create: (data: CreatePaymentDTO) => Promise<Payment>;
  update: (params: { id: string; data: Partial<CreatePaymentDTO> }) => Promise<Payment>;
  delete: (id: string) => Promise<void>;
}

export function usePayments(): UsePaymentsReturn {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentApi.getAll,
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants"],
    queryFn: paymentApi.getTenants,
  });

  const { data: contracts = [] } = useQuery({
    queryKey: ["contracts"],
    queryFn: paymentApi.getContracts,
  });

  const createMutation = useMutation({
    mutationFn: paymentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePaymentDTO> }) =>
      paymentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: paymentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });

  return {
    payments,
    tenants,
    contracts,
    isLoading,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
  };
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentApi.getById(id),
    enabled: !!id,
  });
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../api/payment.api";
import { CreatePaymentDTO, Payment, Tenant, Contract, PaymentStatus } from "../types/payment.types";
import { toast } from "react-hot-toast";

export function usePayments() {
  const queryClient = useQueryClient();

  // 1. Busca de Dados com Cache e Tipagem Explícita
  const { data: payments = [], isLoading, refetch } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: paymentApi.getAll,
    staleTime: 1000 * 60 * 5, 
  });

  const { data: tenants = [] } = useQuery<Tenant[]>({
    queryKey: ["tenants"],
    queryFn: paymentApi.getTenants,
  });

  const { data: contracts = [] } = useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: paymentApi.getContracts,
  });

  // 2. Mutação para Criar Pagamento
  const createMutation = useMutation({
    mutationFn: (data: CreatePaymentDTO) => paymentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento registrado!");
    },
  });

  // 3. Mutação para ATUALIZAR STATUS (Ajustada para os seus tipos)
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, paymentDate }: { id: string; status: PaymentStatus; paymentDate?: Date }) =>
      paymentApi.update(id, { 
        status, 
        // Convertemos para string se o seu DTO exigir string, ou mantemos Date se for flexível
        paymentDate: (paymentDate || new Date()) as any 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento confirmado e recibo gerado!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Erro ao atualizar status";
      toast.error(msg);
    }
  });

  // 4. Mutação para Deletar
  const deleteMutation = useMutation({
    mutationFn: (id: string) => paymentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Registro removido.");
    },
  });

  // 5. Mutação para Gerar Projeção Automática
  const generateAutoMutation = useMutation({
    mutationFn: (contractId: string) => paymentApi.generateAuto(contractId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`${data.count || 'As'} parcelas foram geradas!`);
    }
  });

  return {
    payments,
    tenants,
    contracts,
    isLoading,
    refetch,
    create: createMutation.mutateAsync,
    // ✅ O cast 'as PaymentStatus' aqui mata o erro ts(2322) de vez
    confirmPayment: (id: string) => 
      updateStatusMutation.mutateAsync({ 
        id, 
        status: "PAGO" as PaymentStatus 
      }),
    delete: deleteMutation.mutateAsync,
    generateAuto: generateAutoMutation.mutateAsync,
    isProcessing: updateStatusMutation.isPending || generateAutoMutation.isPending
  };
}
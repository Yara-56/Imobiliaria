// frontend/src/features/contracts/hooks/useContracts.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractApi } from "../api/contract.api";
import { toaster } from "@/components/ui/toaster";
import type { CreateContractDTO, ContractStatus } from "../types/contract.types";

export const useContracts = (id?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["contracts"],
    queryFn: contractApi.list,
    staleTime: 1000 * 60 * 5,
    enabled: !id,
  });

  const singleQuery = useQuery({
    queryKey: ["contracts", id],
    queryFn: () => contractApi.getById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateContractDTO) => contractApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toaster.create({ title: "Contrato criado com sucesso!", type: "success" });
    },
    onError: (error: any) => {
      toaster.create({
        title: "Erro ao criar contrato",
        description: error?.response?.data?.message ?? "Tente novamente.",
        type: "error",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContractStatus }) =>
      contractApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toaster.create({ title: "Status atualizado!", type: "success" });
    },
    onError: () => {
      toaster.create({ title: "Erro ao atualizar status", type: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toaster.create({ title: "Contrato removido", type: "success" });
    },
    onError: () => {
      toaster.create({ title: "Erro ao remover contrato", type: "error" });
    },
  });

  return {
    contracts: listQuery.data ?? [],
    contract: singleQuery.data,

    isLoading: listQuery.isLoading,
    isError: listQuery.isError,

    createContract: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteContract: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
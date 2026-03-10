// frontend/src/features/contracts/types/contract.types.ts

export type ContractStatus = "DRAFT" | "ACTIVE" | "PENDING" | "CANCELLED" | "FINISHED";

export type PaymentMethod = "PIX" | "BOLETO" | "CARTAO_RECORRENTE" | "DINHEIRO" | "TRANSFERENCIA";

export interface Contract {
  _id: string;
  contractNumber?: string;
  rentAmount: number;
  dueDay: number;
  startDate: string;
  endDate?: string;
  depositValue?: number;
  paymentMethod: PaymentMethod;
  status: ContractStatus;
  notes?: string;
  property: {
    _id?: string;
    title: string;
    address: string;
  };
  renter: {
    _id?: string;
    fullName: string;
  };
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContractDTO {
  propertyId: string;
  renterId: string;
  rentAmount: number;
  dueDay: number;
  startDate: string;
  endDate?: string;
  depositValue?: number;
  paymentMethod: PaymentMethod;
  contractNumber?: string;
  notes?: string;
}

export type UpdateContractDTO = Partial<CreateContractDTO> & {
  status?: ContractStatus;
};

// src/modules/contracts/domain/contract.types.ts

import { ContractStatus, PaymentMethod } from "@prisma/client";

/**
 * Tipos enviados pelo FRONTEND para CRIAÇÃO e ATUALIZAÇÃO.
 * Aceita string ou number (normalização no service).
 */
export interface IContractInput {
  propertyId: string;
  renterId: string;

  rentAmount: number | string;
  dueDay: number | string;

  startDate: string | Date;
  endDate?: string | Date | null;

  depositValue?: number | string | null;

  paymentMethod: PaymentMethod;
  notes?: string | null;

  contractNumber?: string | null;
}

/**
 * Tipo COMPLETO de um contrato vindo do Prisma.
 * Compatível 100% com o ContractRepository.
 */
export interface IContract {
  id: string;
  contractNumber: string | null; // CORREÇÃO CRÍTICA

  tenantId: string;
  propertyId: string;
  renterId: string;
  userId: string;

  rentAmount: number;
  dueDay: number;

  startDate: Date;
  endDate: Date | null;

  depositValue: number | null;
  paymentMethod: PaymentMethod;

  status: ContractStatus;
  notes: string | null;

  signedUrl?: string | null;

  createdAt: Date;
  updatedAt: Date;

  // relações carregadas pelo include do Prisma
  property?: any;
  renter?: any;
  payments?: any[];
}

/**
 * Tipo permitido para atualizar contrato.
 * Somente campos realmente editáveis.
 */
export interface IContractUpdate {
  rentAmount?: number | string;
  dueDay?: number | string;

  startDate?: string | Date;
  endDate?: string | Date | null;

  depositValue?: number | string | null;

  paymentMethod?: PaymentMethod;
  notes?: string | null;

  status?: ContractStatus;
}
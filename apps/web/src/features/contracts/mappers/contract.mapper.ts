// src/features/contracts/mappers/contract.mapper.ts
import type { Contract, CreateContractDTO } from "../types/contract.types";

export function mapApiToContract(apiData: any): Contract {
  return {
    _id: apiData._id || apiData.id,
    contractNumber: apiData.contractNumber,
    rentAmount: Number(apiData.rentAmount),
    dueDay: Number(apiData.dueDay),
    startDate: apiData.startDate,
    endDate: apiData.endDate,
    depositValue: apiData.depositValue ? Number(apiData.depositValue) : undefined,
    paymentMethod: apiData.paymentMethod,
    status: apiData.status,
    notes: apiData.notes,
    property: {
      _id: apiData.property?._id,
      title: apiData.property?.title || "Imóvel sem título",
      address: apiData.property?.address || "Endereço não informado",
    },
    renter: {
      _id: apiData.renter?._id,
      fullName: apiData.renter?.fullName || "Locatário não identificado",
    },
    tenantId: apiData.tenantId,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
  };
}

export function mapContractToApi(data: CreateContractDTO) {
  return {
    propertyId: data.propertyId,
    renterId: data.renterId,
    rentAmount: data.rentAmount,
    dueDay: data.dueDay,
    startDate: data.startDate,
    endDate: data.endDate,
    depositValue: data.depositValue,
    paymentMethod: data.paymentMethod,
    contractNumber: data.contractNumber,
    notes: data.notes,
  };
}
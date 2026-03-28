// src/modules/contracts/domain/contract.entity.ts

import { ContractStatus, PaymentMethod } from "@prisma/client";

export class ContractEntity {
  id!: string;
  contractNumber!: string;

  tenantId!: string;
  propertyId!: string;
  renterId!: string;
  userId!: string;

  rentAmount!: number;
  dueDay!: number;

  startDate!: Date;
  endDate!: Date | null;

  depositValue!: number | null;
  paymentMethod!: PaymentMethod;

  status!: ContractStatus;
  notes!: string | null;

  signedUrl?: string | null;

  createdAt!: Date;
  updatedAt!: Date;

  /**
   * Construtor protegido — use `ContractEntity.create()`
   */
  private constructor(props: Partial<ContractEntity>) {
    Object.assign(this, props);
  }

  /**
   * 🟦 Criação de entidade a partir de dados crus (Service → Domain)
   */
  static create(input: {
    propertyId: string;
    renterId: string;
    userId: string;
    tenantId: string;

    rentAmount: number | string;
    dueDay: number | string;

    startDate: string | Date;
    endDate?: string | Date | null;

    depositValue?: number | string | null;
    paymentMethod: PaymentMethod;

    notes?: string | null;
    contractNumber?: string;
  }) {
    return new ContractEntity({
      propertyId: input.propertyId,
      renterId: input.renterId,
      tenantId: input.tenantId,
      userId: input.userId,

      rentAmount: Number(input.rentAmount),
      dueDay: Number(input.dueDay),

      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,

      depositValue: input.depositValue ? Number(input.depositValue) : null,
      paymentMethod: input.paymentMethod,

      status: ContractStatus.DRAFT,
      notes: input.notes ?? null,

      contractNumber:
        input.contractNumber ??
        `CNT-${new Date().getFullYear()}-${Date.now()}`,

      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * 🟩 Atualização segura com whitelist
   */
  update(data: Partial<ContractEntity>) {
    const allowed = [
      "rentAmount",
      "dueDay",
      "startDate",
      "endDate",
      "depositValue",
      "paymentMethod",
      "notes",
      "status",
    ];

    for (const key of Object.keys(data)) {
      if (allowed.includes(key)) {
        // Normalização
        if (key === "startDate" || key === "endDate") {
          // @ts-ignore
          this[key] = data[key] ? new Date(data[key] as any) : null;
        } else if (key === "rentAmount" || key === "depositValue") {
          // @ts-ignore
          this[key] = Number(data[key]);
        } else {
          // @ts-ignore
          this[key] = data[key];
        }
      }
    }

    this.updatedAt = new Date();
  }

  /**
   * 🟧 Finaliza contrato (Webhooks de assinatura)
   */
  markAsSigned(url: string) {
    this.status = ContractStatus.ACTIVE;
    this.signedUrl = url;
    this.updatedAt = new Date();
  }

  /**
   * 🟨 Serialização para JSON seguro (Frontend-friendly)
   */
  toJSON() {
    return {
      id: this.id,
      contractNumber: this.contractNumber,

      tenantId: this.tenantId,
      propertyId: this.propertyId,
      renterId: this.renterId,
      userId: this.userId,

      rentAmount: this.rentAmount,
      dueDay: this.dueDay,

      startDate: this.startDate,
      endDate: this.endDate,

      depositValue: this.depositValue,
      paymentMethod: this.paymentMethod,

      status: this.status,
      notes: this.notes,
      signedUrl: this.signedUrl,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
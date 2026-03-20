// ===== TYPES CORE =====

export interface Tenant {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  }
  
  export interface Contract {
    _id: string;
    propertyAddress: string;
    rentAmount: number;
    tenantId: string;
  }
  
  export interface Payment {
    _id: string;
    tenantId: Tenant | string;
    contractId: Contract | string;
    amount: number;
    discount: number;
    lateFee: number;
    totalAmount: number;
    dueDate: string;
    paymentDate?: string;
    status: "Pendente" | "Pago" | "Atrasado";
    paymentMethod?: string;
    description?: string;
    referenceMonth?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePaymentDTO {
    tenantId: string;
    contractId: string;
    amount: number;
    discount?: number;
    lateFee?: number;
    dueDate: string;
    paymentDate?: string;
    status: "Pendente" | "Pago" | "Atrasado";
    paymentMethod?: string;
    description?: string;
    referenceMonth?: string;
    notes?: string;
  }
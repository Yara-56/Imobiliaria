/**
 * 💸 Tipagem Financeira - Aura ImobiSys
 * Alinhada com o isolamento de dados e o Schema do MongoDB.
 */

export type PaymentStatus = "Pendente" | "Pago" | "Atrasado" | "Cancelado";
export type PaymentMethod = "pix" | "boleto" | "cartao" | "dinheiro";

/**
 * 💰 Interface Master de Pagamentos
 * Define a estrutura de um lançamento financeiro no cluster.
 */
export interface Payment {
  _id: string;          // ID único do MongoDB
  amount: number;       // Valor numérico para cálculos matemáticos
  referenceMonth: string; // Ex: "Janeiro/2026"
  dueDate: string;      // Data de vencimento
  paymentDate?: string; // Data real do pagamento (opcional)
  status: PaymentStatus;
  method?: PaymentMethod;
  
  // Relacionamentos (Populados pelo backend)
  tenantId?: {
    _id: string;
    fullName: string;
  };
  contractId?: {
    _id: string;
    propertyAddress: string;
  };
  
  receiptUrl?: string;  // Link para o arquivo de comprovante
  notes?: string;       // Observações internas
  createdAt: string;
  updatedAt?: string;
}

/**
 * 📝 DTOs para Comunicação API 
 * Seguindo o padrão NodeNext/Tree Shaking do seu MacBook.
 */
export type CreatePaymentDTO = Omit<Payment, "_id" | "createdAt" | "updatedAt" | "tenantId" | "contractId"> & {
  tenantId: string;     // ID simples para envio no POST
  contractId: string;   // ID simples para envio no POST
  receiptFile?: File;   // ✅ Suporte para upload via FormData
};

export type UpdatePaymentDTO = Partial<CreatePaymentDTO> & {
  _id: string;          // Necessário para identificar a instância no cluster
};
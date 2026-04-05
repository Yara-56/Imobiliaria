export interface CashPayment {
    receivedBy: string; // ID do Admin que recebeu
    physicalReceiptId: string; // Número do recibo de papel
    location: "Escritório" | "Visita Local";
  }
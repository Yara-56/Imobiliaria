export interface PixPayment {
  qrCode: string;
  copyPaste: string;
  expiresAt: string; // Padrão 30 minutos
  pspProvider: "MercadoPago" | "Stripe" | "AuraSafe";
}
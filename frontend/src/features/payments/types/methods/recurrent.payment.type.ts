export interface RecurrentPayment {
    cardBrand: "visa" | "mastercard" | "elo";
    lastFour: string;
    subscriptionId: string;
  }
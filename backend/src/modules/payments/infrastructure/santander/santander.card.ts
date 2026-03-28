import { SantanderClient } from "./santander.client";

export class SantanderCardService {
  constructor(private client: SantanderClient) {}

  async chargeCard(data: {
    amount: number;
    cardToken: string;
    description: string;
  }) {
    const payload = {
      amount: Math.round(data.amount * 100),
      currency: "BRL",
      order: {
        description: data.description,
      },
      payment: {
        type: "credit",
        installments: 1,
      },
      card: {
        token: data.cardToken,
      },
    };

    const response = await this.client.http.post(
      "/card/v1/payments",
      payload
    );

    return response.data;
  }
}
import { SantanderClient } from "./santander.client.js";

export class SantanderPixService {
  constructor(private client: SantanderClient) {}

  async createCharge(data: {
    amount: number;
    description: string;
    payerName: string;
    payerCPF: string;
  }) {
    const payload = {
      calendario: { expiracao: 3600 },
      devedor: {
        cpf: data.payerCPF,
        nome: data.payerName,
      },
      valor: { original: data.amount.toFixed(2) },
      chave: process.env.SANTANDER_PIX_KEY,
      solicitacaoPagador: data.description,
    };

    const response = await this.client.http.post(
      "/pix/v1/cob",
      payload
    );

    return response.data;
  }

  async getQRCode(txid: string) {
    const res = await this.client.http.get(`/pix/v1/cob/${txid}/qrcode`);
    return res.data;
  }
}
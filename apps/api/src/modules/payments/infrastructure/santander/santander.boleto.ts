import { SantanderClient } from "./santander.client.js";

export class SantanderBoletoService {
  constructor(private client: SantanderClient) {}

  async createBoleto(data: {
    amount: number;
    payerName: string;
    payerCPF: string;
    dueDate: string;
    description: string;
  }) {
    const payload = {
      numeroTitulo: Date.now().toString(),
      dataVencimento: data.dueDate,
      valor: data.amount.toFixed(2),
      pagador: {
        tipoPessoa: "F",
        nome: data.payerName,
        documento: data.payerCPF,
      },
      descricao: data.description,
    };

    const res = await this.client.http.post("/boletos/v1/", payload);
    return res.data;
  }
}
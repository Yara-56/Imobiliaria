import { SantanderClient } from "./santander.client.js";

export class SantanderDebitService {
  constructor(private client: SantanderClient) {}

  async registerDebit(data: {
    account: string;
    agency: string;
    cpf: string;
    name: string;
  }) {
    const payload = {
      codigoBanco: "033",
      agencia: data.agency,
      conta: data.account,
      titularCPF: data.cpf,
      titularNome: data.name,
    };

    const res = await this.client.http.post(
      "/debit/v1/authorize",
      payload
    );

    return res.data;
  }
}
import axios, { AxiosInstance } from "axios";

export class SantanderClient {
  private client: AxiosInstance;

  constructor(private token: string, private isSandbox = true) {
    this.client = axios.create({
      baseURL: isSandbox
        ? "https://trust-sandbox.api.santander.com.br"
        : "https://trust.api.santander.com.br",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
  }

  get http() {
    return this.client;
  }
}
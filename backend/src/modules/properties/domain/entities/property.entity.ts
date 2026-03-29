import { v4 as uuidv4 } from "uuid";
import { PropertyStatus } from "@prisma/client";

export class Property {
  id: string;
  title: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  rentValue: number;
  status: PropertyStatus;
  documentUrl: string | null; // ✅ Novo campo para o PDF
  tenantId: string;
  userId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    title: string;
    description?: string | null;
    address: string;
    city: string;
    state: string;
    zipCode?: string | null;
    rentValue?: number; // Opcional no input para aceitar fallback
    price?: number;     // ✅ Adicionado para aceitar o que vem do Prisma
    status?: PropertyStatus;
    documentUrl?: string | null;
    tenantId: string;
    userId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.title = this.validateTitle(data.title);
    this.description = data.description ?? null;
    this.address = this.validateAddress(data.address);
    this.city = this.validateCity(data.city);
    this.state = this.validateState(data.state);
    this.zipCode = this.validateZipCode(data.zipCode ?? null);

    // ✅ Resolve o conflito: se vier 'price' do banco, vira 'rentValue' no domínio
    const financialValue = data.rentValue ?? data.price ?? 0;
    this.rentValue = this.validateRentValue(financialValue);

    this.status = data.status ?? PropertyStatus.DISPONIVEL;
    this.documentUrl = data.documentUrl ?? null;
    this.tenantId = data.tenantId;
    this.userId = data.userId ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
  }

  private validateTitle(value: string) {
    if (!value || value.trim().length < 3) throw new Error("Título deve ter no mínimo 3 caracteres");
    return value.trim();
  }

  private validateAddress(value: string) {
    if (!value || value.trim().length < 5) throw new Error("Endereço inválido");
    return value.trim();
  }

  private validateCity(value: string) {
    if (!value || value.trim().length < 2) throw new Error("Cidade inválida");
    return value.trim();
  }

  private validateState(value: string) {
    if (!value || value.length !== 2) throw new Error("UF deve ter exatamente 2 caracteres");
    return value.toUpperCase();
  }

  private validateZipCode(zip?: string | null): string | null {
    if (!zip) return null;
    const regex = /^\d{5}-?\d{3}$/;
    if (!regex.test(zip)) throw new Error("CEP deve estar no formato 00000-000");
    return zip.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  private validateRentValue(value: number) {
    if (typeof value !== "number" || isNaN(value)) throw new Error("Valor do aluguel deve ser um número");
    if (value < 0) throw new Error("O valor do aluguel não pode ser negativo");
    return value;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      rentValue: this.rentValue,
      status: this.status,
      documentUrl: this.documentUrl,
      tenantId: this.tenantId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
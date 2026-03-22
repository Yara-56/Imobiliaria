import { v4 as uuidv4 } from 'uuid';

export class Tenant {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  documentUrl: string | null;
  notes: string | null;
  propertyId: string | null;
  tenantId: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id?: string;
    fullName: string;
    email?: string | null;
    phone?: string | null;
    cpf?: string | null;
    documentUrl?: string | null;
    notes?: string | null;
    propertyId?: string | null;
    tenantId: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.fullName = this.validateFullName(data.fullName);
    this.email = this.validateEmail(data.email);
    this.phone = this.validatePhone(data.phone);
    this.cpf = this.validateCPF(data.cpf);
    this.documentUrl = data.documentUrl || null;
    this.notes = data.notes || null;
    this.propertyId = data.propertyId || null;
    this.tenantId = data.tenantId;
    this.userId = data.userId;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  private validateFullName(fullName: string): string {
    if (!fullName || fullName.trim().length < 3) {
      throw new Error('Nome completo deve ter no mínimo 3 caracteres');
    }
    return fullName.trim();
  }

  private validateEmail(email: string | null | undefined): string | null {
    if (!email) return null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
    return email.toLowerCase();
  }

  private validatePhone(phone: string | null | undefined): string | null {
    if (!phone) return null;

    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Telefone deve estar no formato (XX) XXXXX-XXXX');
    }
    return phone;
  }

  private validateCPF(cpf: string | null | undefined): string | null {
    if (!cpf) return null;

    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      throw new Error('CPF deve conter 11 dígitos');
    }

    if (!this.isValidCPF(cleanCPF)) {
      throw new Error('CPF inválido');
    }

    return cleanCPF;
  }

  private isValidCPF(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  public toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      cpf: this.cpf ? this.formatCPF(this.cpf) : null,
      documentUrl: this.documentUrl,
      notes: this.notes,
      propertyId: this.propertyId,
      tenantId: this.tenantId,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
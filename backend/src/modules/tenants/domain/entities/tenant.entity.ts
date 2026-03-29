import { v4 as uuidv4 } from 'uuid';
import { RenterStatus } from "@prisma/client";

export interface TenantProps {
  id?: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  documentUrl?: string | null;
  notes?: string | null;
  propertyId?: string | null;
  tenantId: string;
  userId?: string | null; // ✅ Essencial para o multi-tenancy
  status?: RenterStatus;  // ✅ Essencial para bater com o Prisma
  createdAt?: Date;
  updatedAt?: Date;
}

export class Tenant {
  private _id: string;
  private props: Required<TenantProps>;

  constructor(data: TenantProps) {
    this._id = data.id || uuidv4();
    
    // Inicializamos o objeto props antes de chamar as validações
    this.props = {
      ...data,
      id: this._id,
      email: data.email ?? null,
      phone: data.phone ?? null,
      cpf: data.cpf ?? null,
      documentUrl: data.documentUrl ?? null,
      notes: data.notes ?? null,
      propertyId: data.propertyId ?? null,
      userId: data.userId ?? null,
      status: data.status || RenterStatus.ATIVO,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    };

    // Aplicamos as validações e reatribuímos os valores limpos
    this.props.fullName = this.validateFullName(this.props.fullName);
    this.props.email = this.validateEmail(this.props.email);
    this.props.cpf = this.validateCPF(this.props.cpf);
  }

  // ✅ GETTERS: O Repositório Prisma usa esses métodos para ler os dados
  get id() { return this._id; }
  get fullName() { return this.props.fullName; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get cpf() { return this.props.cpf; }
  get documentUrl() { return this.props.documentUrl; }
  get notes() { return this.props.notes; }
  get propertyId() { return this.props.propertyId; }
  get tenantId() { return this.props.tenantId; }
  get userId() { return this.props.userId; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  // ============================================
  // REGRAS DE NEGÓCIO (VALIDAÇÕES)
  // ============================================

  private validateFullName(fullName: string): string {
    if (!fullName || fullName.trim().length < 3) {
      throw new Error('Nome completo deve ter no mínimo 3 caracteres');
    }
    return fullName.trim();
  }

  private validateEmail(email: string | null | undefined): string | null {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error('Email inválido');
    return email.toLowerCase();
  }

  private validateCPF(cpf: string | null | undefined): string | null {
    if (!cpf) return null;
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) throw new Error('CPF deve conter 11 dígitos');
    if (!this.isValidCPF(cleanCPF)) throw new Error('CPF inválido');
    return cleanCPF;
  }

  private isValidCPF(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
  }

  public toJSON() {
    return {
      ...this.props,
      cpf: this.props.cpf ? this.formatCPF(this.props.cpf) : null,
    };
  }

  private formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
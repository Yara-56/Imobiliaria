import { ContractStatus, PaymentMethod } from "@prisma/client";

/**
 * 📝 INTERFACE DE PROPRIEDADES (O DNA do Contrato)
 * ✅ Define a estrutura completa para o Domínio e Persistência
 */
export interface IContractProps {
  id?: string;
  contractNumber: string;
  tenantId: string;    // ID da Imobiliária (Isolamento Multi-tenant)
  propertyId: string;  // ID do Imóvel
  renterId: string;    // ID do Inquilino
  userId: string;      // ID do Corretor/Admin
  templateId: string | null;

  rentAmount: number;
  dueDay: number;
  startDate: Date;
  endDate: Date | null;
  depositValue: number | null;
  paymentMethod: PaymentMethod;
  
  status: ContractStatus;
  notes: string | null;

  // Documentação e Conteúdo
  generatedContent?: string | null;
  documentUrl?: string | null;

  // Assinatura
  signedUrl?: string | null;
  signedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ✅ ENTIDADE CONTRACT (CONTRATO)
 * Responsável por validar as regras de negócio de uma locação.
 */
export class ContractEntity {
  private props: IContractProps;

  private constructor(props: IContractProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
    this.validate();
  }

  // ==========================================
  // 🏗️ FACTORIES (Criação e Restauração)
  // ==========================================

  /**
   * ➕ Cria um novo contrato do zero (Status: DRAFT)
   */
  static create(input: {
    tenantId: string;
    propertyId: string;
    renterId: string;
    userId: string;
    templateId: string | null;
    rentAmount: number | string;
    dueDay: number | string;
    startDate: string | Date;
    endDate?: string | Date | null;
    depositValue?: number | string | null;
    paymentMethod: PaymentMethod;
    notes?: string | null;
  }): ContractEntity {
    return new ContractEntity({
      contractNumber: this.generateContractNumber(),
      tenantId: input.tenantId,
      propertyId: input.propertyId,
      renterId: input.renterId,
      userId: input.userId,
      templateId: input.templateId,
      
      rentAmount: Number(input.rentAmount),
      dueDay: Number(input.dueDay),
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      depositValue: input.depositValue ? Number(input.depositValue) : null,
      paymentMethod: input.paymentMethod,
      
      status: ContractStatus.DRAFT,
      notes: input.notes ?? null,
    });
  }

  /**
   * 🔄 Reconstrói a entidade vinda do Banco de Dados
   * ✅ O cast 'as any' previne conflitos de tipos entre Prisma e Domínio
   */
  static restore(props: any): ContractEntity {
    return new ContractEntity(props as IContractProps);
  }

  // ==========================================
  // 🔐 MÉTODOS DE DOMÍNIO (Regras)
  // ==========================================

  public updateTemplate(templateId: string): void {
    this.props.templateId = templateId;
    this.touch();
  }

  public generateFromTemplate(templateContent: string, data: Record<string, any>): void {
    let content = templateContent;
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, "g");
      content = content.replace(regex, String(data[key]));
    }
    this.props.generatedContent = content;
    this.touch();
  }

  public markAsSigned(signedUrl: string): void {
    this.props.status = ContractStatus.ACTIVE;
    this.props.signedUrl = signedUrl;
    this.props.signedAt = new Date();
    this.touch();
  }

  public terminate(): void {
    this.props.status = ContractStatus.FINISHED;
    this.props.endDate = new Date();
    this.touch();
  }

  private validate(): void {
    if (this.props.rentAmount <= 0) throw new Error("Valor do aluguel inválido.");
    if (this.props.dueDay < 1 || this.props.dueDay > 31) throw new Error("Vencimento inválido.");
    if (!this.props.tenantId) throw new Error("Segurança: TenantId é obrigatório.");
  }

  private static generateContractNumber(): string {
    return `CNT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  // ==========================================
  // 🔍 GETTERS (Essenciais para o Mapper/Service)
  // ==========================================

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get propertyId() { return this.props.propertyId; }
  get renterId() { return this.props.renterId; }
  get userId() { return this.props.userId; }
  get templateId() { return this.props.templateId; }
  get rentAmount() { return this.props.rentAmount; }
  get dueDay() { return this.props.dueDay; }
  get startDate() { return this.props.startDate; }
  get endDate() { return this.props.endDate; }
  get depositValue() { return this.props.depositValue; }
  get paymentMethod() { return this.props.paymentMethod; }
  get status() { return this.props.status; }
  get contractNumber() { return this.props.contractNumber; }
  get documentUrl() { return this.props.documentUrl; }
  get notes() { return this.props.notes; }
  get generatedContent() { return this.props.generatedContent; }
  get signedUrl() { return this.props.signedUrl; }
  get signedAt() { return this.props.signedAt; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  /**
   * ✅ Serialização completa para Persistência/API
   * Resolve todos os erros de "propriedade não existe" no Mapper (ts2339)
   */
  public toJSON() {
    return {
      id: this.props.id,
      contractNumber: this.props.contractNumber,
      tenantId: this.props.tenantId,
      propertyId: this.props.propertyId,
      renterId: this.props.renterId,
      userId: this.props.userId,
      templateId: this.props.templateId,
      rentAmount: this.props.rentAmount,
      dueDay: this.props.dueDay,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      depositValue: this.props.depositValue,
      paymentMethod: this.props.paymentMethod,
      status: this.props.status,
      notes: this.props.notes,
      generatedContent: this.props.generatedContent,
      documentUrl: this.props.documentUrl,
      signedUrl: this.props.signedUrl,
      signedAt: this.props.signedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
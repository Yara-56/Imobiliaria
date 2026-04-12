/**
 * ✅ SUB-ENTIDADE: Documento do Inquilino
 * Resolve o erro ts(2305) no TenantDocumentService
 */
export type DocumentType = "RG" | "CPF" | "PROOF_OF_RESIDENCE" | "CONTRACT" | "OTHER";

export interface ITenantDocumentProps {
  id?: string;
  renterId: string;
  tenantId: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  createdAt?: Date;
}

export class TenantDocument {
  private props: ITenantDocumentProps;

  constructor(props: ITenantDocumentProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public static create(props: ITenantDocumentProps): TenantDocument {
    return new TenantDocument(props);
  }

  get propsValue() { return this.props; }
}

/**
 * ✅ INTERFACE DE PROPRIEDADES (O DNA do Inquilino)
 */
export interface ITenantProps {
  id?: string;
  fullName: string;
  type?: string;
  preferredPaymentMethod?: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  notes?: string | null;
  avatarUrl?: string; 
  tenantId: string;
  userId: string;
  documents?: TenantDocument[]; // 📂 Coleção de documentos anexados
  
  // 🏠 Dados da Locação / Associação com Imóvel
  propertyId?: string | null;
  rentValue?: number | null;
  billingDay?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ✅ ENTIDADE TENANT (INQUILINO/RENTER)
 */
export class Tenant {
  private props: ITenantProps;
  private _documents: TenantDocument[] = [];

  private constructor(props: ITenantProps) {
    this.props = props;
    this._documents = props.documents || [];
    this.validate();
  }

  public static create(props: ITenantProps): Tenant {
    const now = new Date();
    return new Tenant({
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  public static restore(props: ITenantProps): Tenant {
    return new Tenant(props);
  }

  // ==========================================
  // 🛠️ MÉTODOS DE DOMÍNIO (Comportamento)
  // ==========================================

  /**
   * ✅ Adiciona um documento à lista do inquilino
   * Resolve o erro ts(2339) no Service
   */
  public addDocument(document: TenantDocument): void {
    this._documents.push(document);
    this.touch();
  }

  /**
   * ✅ Valida se os documentos essenciais (RG/CPF) foram enviados
   * Resolve o erro ts(2339) no Service
   */
  public validateRequiredDocuments(): void {
    const types = this._documents.map(doc => doc.propsValue.type);
    
    // Regra de negócio SaaS: Todo inquilino precisa de RG e CPF
    const missing = ["RG", "CPF"].filter(type => !types.includes(type as DocumentType));
    
    if (missing.length > 0) {
      console.warn(`⚠️ Inquilino ${this.fullName} com documentos pendentes: ${missing.join(", ")}`);
    }
  }

  public updateFullName(name: string): void {
    if (!name || name.length < 3) throw new Error("Nome muito curto");
    this.props.fullName = name;
    this.touch();
  }

  public updateAvatar(url: string): void {
    this.props.avatarUrl = url;
    this.touch();
  }

  public updateEmail(email: string | null): void { this.props.email = email; this.touch(); }
  public updateCPF(cpf: string | null): void { this.props.cpf = cpf; this.touch(); }
  public updatePhone(phone: string | null): void { this.props.phone = phone; this.touch(); }
  public updateNotes(notes: string | null): void { this.props.notes = notes; this.touch(); }

  // ✅ Associa o inquilino a um imóvel específico e define regras de cobrança
  public assignProperty(propertyId: string, rentValue: number, billingDay: number): void {
    this.props.propertyId = propertyId;
    this.props.rentValue = rentValue;
    this.props.billingDay = billingDay;
    this.touch();
  }

  private touch(): void { this.props.updatedAt = new Date(); }

  private validate(): void {
    // ✅ Previne que dados antigos/incompletos no banco causem Erro 500 na Listagem
    if (!this.props.fullName) {
      this.props.fullName = "Inquilino (Sem Nome)";
    }
    if (!this.props.tenantId) {
      this.props.tenantId = this.props.userId || "legacy-tenant";
    }
  }

  // ==========================================
  // 🔍 GETTERS
  // ==========================================

  get id() { return this.props.id; }
  get type() { return this.props.type; }
  get preferredPaymentMethod() { return this.props.preferredPaymentMethod; }
  get fullName() { return this.props.fullName; }
  get email() { return this.props.email; }
  get phone() { return this.props.phone; }
  get cpf() { return this.props.cpf; }
  get notes() { return this.props.notes; }
  get avatarUrl() { return this.props.avatarUrl; }
  get tenantId() { return this.props.tenantId; }
  get userId() { return this.props.userId; }
  get documents() { return this._documents; }
  get propertyId() { return this.props.propertyId; }
  get rentValue() { return this.props.rentValue; }
  get billingDay() { return this.props.billingDay; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  public toJSON() {
    return {
      ...this.props,
      documents: this._documents.map(doc => doc.propsValue),
    };
  }
}
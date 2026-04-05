export interface IContractTemplateProps {
  id?: string;
  name: string;
  content: string;      // O corpo do texto com {{tags}}
  variables: string[];  // Ex: ["renterName", "rentValue"]
  tenantId: string;     // Isolamento Multi-tenant
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ContractTemplateEntity {
  private props: IContractTemplateProps;

  private constructor(props: IContractTemplateProps) {
    this.props = props;
    this.validate();
  }

  // =========================
  // 🟦 CREATE (Factory para novos)
  // =========================
  static create(input: {
    name: string;
    content: string;
    tenantId: string;
    variables?: string[];
  }): ContractTemplateEntity {
    const now = new Date();
    // Extrai variáveis automaticamente se não enviadas
    const detectedVariables = input.variables ?? this.extractVariables(input.content);

    return new ContractTemplateEntity({
      name: input.name,
      content: input.content,
      tenantId: input.tenantId,
      variables: detectedVariables,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  // =========================
  // 🔄 RESTORE (Para o Mapper/Banco)
  // =========================
  static restore(props: IContractTemplateProps): ContractTemplateEntity {
    return new ContractTemplateEntity(props);
  }

  // =========================
  // 🔍 HELPER: Extração Automática
  // =========================
  private static extractVariables(content: string): string[] {
    const regex = /{{(.*?)}}/g;
    const matches = content.match(regex);
    if (!matches) return [];
    
    // Remove as chaves e remove duplicatas
    return [...new Set(matches.map(m => m.replace(/{{|}}/g, "").trim()))];
  }

  // =========================
  // ✅ VALIDAÇÃO FORTE
  // =========================
  private validate() {
    if (!this.props.name || this.props.name.length < 3) {
      throw new Error("O nome do template deve ter pelo menos 3 caracteres.");
    }
    if (!this.props.content) {
      throw new Error("O conteúdo do template não pode estar vazio.");
    }
    if (!this.props.tenantId) {
      throw new Error("TenantId é obrigatório para templates de contrato.");
    }
  }

  // =========================
  // 🟩 UPDATE CONTROLADO
  // =========================
  public update(data: { name?: string; content?: string; isActive?: boolean }): void {
    if (data.name) this.props.name = data.name;
    
    if (data.content) {
      this.props.content = data.content;
      // Ao mudar o conteúdo, re-extraímos as variáveis automaticamente
      this.props.variables = ContractTemplateEntity.extractVariables(data.content);
    }
    
    if (typeof data.isActive === "boolean") {
      this.props.isActive = data.isActive;
    }
    
    this.props.updatedAt = new Date();
  }

  // =========================
  // 🟨 GETTERS (Para Repository/Mapper)
  // =========================
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get content() { return this.props.content; }
  get variables() { return this.props.variables; }
  get tenantId() { return this.props.tenantId; }
  get isActive() { return this.props.isActive; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  /**
   * Serialização para persistência ou API
   */
  public toJSON() {
    return {
      ...this.props,
    };
  }
}
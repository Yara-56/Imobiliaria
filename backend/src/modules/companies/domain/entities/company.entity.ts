type CompanyProps = {
    name: string;
    cnpj: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
  
  export class Company {
    private _id: string;
    private props: CompanyProps;
  
    private constructor(props: CompanyProps, id?: string) {
      this._id = id ?? crypto.randomUUID();
      this.props = {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      };
    }
  
    // ========================
    // FACTORY
    // ========================
    static create(props: CompanyProps, id?: string) {
      this.validate(props);
      return new Company(props, id);
    }
  
    // ========================
    // GETTERS
    // ========================
    get id() {
      return this._id;
    }
  
    get name() {
      return this.props.name;
    }
  
    get cnpj() {
      return this.props.cnpj;
    }
  
    get createdAt() {
      return this.props.createdAt!;
    }
  
    get updatedAt() {
      return this.props.updatedAt!;
    }
  
    // ========================
    // BEHAVIOR (REGRAS)
    // ========================
    updateName(name: string) {
      if (!name || name.length < 3) {
        throw new Error("Nome inválido");
      }
  
      this.props.name = name;
      this.touch();
    }
  
    // ========================
    // INTERNAL
    // ========================
    private touch() {
      this.props.updatedAt = new Date();
    }
  
    // ========================
    // VALIDATION
    // ========================
    private static validate(props: CompanyProps) {
      if (!props.name || props.name.length < 3) {
        throw new Error("Nome da empresa inválido");
      }
  
      if (!this.isValidCNPJ(props.cnpj)) {
        throw new Error("CNPJ inválido");
      }
    }
  
    private static isValidCNPJ(cnpj: string): boolean {
      const clean = cnpj.replace(/\D/g, "");
  
      if (clean.length !== 14) return false;
      if (/^(\d)\1+$/.test(clean)) return false;
  
      const calcCheckDigit = (base: string, factors: number[]) => {
        const sum = base
          .split("")
          .reduce((acc, num, i) => acc + Number(num) * factors[i], 0);
  
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };
  
      const base = clean.slice(0, 12);
      const digit1 = calcCheckDigit(base, [5,4,3,2,9,8,7,6,5,4,3,2]);
      const digit2 = calcCheckDigit(base + digit1, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  
      return clean === base + digit1 + digit2;
    }
  }
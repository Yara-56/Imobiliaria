export interface Tenant {
  _id: string;
  name: string;
  slug: string; //
  email: string; //
  phone?: string; //
  cpfCnpj?: string; //
  status: "ACTIVE" | "SUSPENDED"; // Alinhado ao backend
  plan: "BASIC" | "PRO" | "ENTERPRISE"; // Alinhado ao backend
  tenantId: string; // Essencial para isolamento
  settings: {
    maxUsers: number; //
    maxProperties: number; //
    features: {
      crm: boolean; //
      automation: boolean; //
    };
  };
  createdAt: string;
}
export interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  status: "active" | "inactive";
  tenantId: string; // Essencial para o isolamento de dados
}
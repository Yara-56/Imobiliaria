export class Tenant {
  id?: string;
  fullName!: string;
  email?: string | null;
  phone?: string | null;
  cpf?: string | null;
  documentUrl?: string | null;
  notes?: string | null;
  propertyId?: string | null;
  tenantId!: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export type PropertyStatus =
  | "DISPONIVEL"
  | "ALUGADO"
  | "MANUTENCAO"
  | "INATIVO";

export interface IPropertyDocument {
  id?: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string | null;
  size?: number | null;
  propertyId?: string;
  createdAt?: Date;
}

export interface IProperty {
  id?: string;
  name: string;
  city: string;
  state: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  number: string;
  sqls: string;
  status: PropertyStatus;
  tenantId: string;
  documents?: IPropertyDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}
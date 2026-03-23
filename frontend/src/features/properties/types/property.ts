/**
 * ======================================================
 * 🏠 IMOBISYS — PROPERTY DOMAIN TYPES
 * ======================================================
 */

export type PropertyStatus =
  | "DISPONIVEL"
  | "ALUGADO"
  | "MANUTENCAO"
  | "INATIVO";

export type PropertyStatusPT =
  | "Disponível"
  | "Alugado"
  | "Manutenção"
  | "Inativo";

export const PROPERTY_STATUS_MAP: Record<PropertyStatus, PropertyStatusPT> = {
  DISPONIVEL: "Disponível",
  ALUGADO: "Alugado",
  MANUTENCAO: "Manutenção",
  INATIVO: "Inativo",
};

export const PROPERTY_STATUS_MAP_REVERSE: Record<PropertyStatusPT, PropertyStatus> = {
  "Disponível": "DISPONIVEL",
  "Alugado": "ALUGADO",
  "Manutenção": "MANUTENCAO",
  "Inativo": "INATIVO",
};

/**
 * Documento anexado ao imóvel
 * Compatível com backend atual e formatos legados
 */
export interface PropertyDocument {
  id?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string | null;
  size?: number | null;
  createdAt?: string;
  originalName?: string;
  filename?: string;
  url?: string;
}

/**
 * Entidade crua da API
 * Alinhada com o backend atual
 */
export interface Property {
  id: string;
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
  documents?: PropertyDocument[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * DTO para criação
 */
export interface CreatePropertyDTO {
  name: string;
  city: string;
  state: string;
  zipCode: string;
  street: string;
  neighborhood: string;
  number: string;
  sqls: string;
  status?: PropertyStatus;
}

/**
 * DTO para atualização parcial
 */
export type UpdatePropertyDTO = Partial<CreatePropertyDTO> & {
  documents?: PropertyDocument[];
};

/**
 * Modelo de exibição da UI
 */
export interface PropertyUI {
  id: string;
  name: string;
  addressText: string;
  cep: string;
  city: string;
  state: string;
  street: string;
  neighborhood: string;
  number: string;
  sqls: string;
  status: PropertyStatusPT;
  statusRaw: PropertyStatus;
  documents?: PropertyDocument[];
  createdAt?: string;
}
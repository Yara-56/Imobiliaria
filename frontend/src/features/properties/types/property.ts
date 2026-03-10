/**
 * ======================================================
 * 🏠 IMOBISYS — PROPERTY DOMAIN TYPES
 * ======================================================
 */

/**
 * Status do imóvel — espelha o enum do backend (PropertyStatus)
 */
export type PropertyStatus =
  | "DISPONIVEL"
  | "ALUGADO"
  | "MANUTENCAO"
  | "INATIVO";

/**
 * Status em português para exibição na UI
 */
export type PropertyStatusPT =
  | "Disponível"
  | "Alugado"
  | "Manutenção"
  | "Inativo";

/**
 * Tipo do imóvel
 */
export type PropertyType =
  | "CASA"
  | "APARTAMENTO"
  | "COMERCIAL"
  | "TERRENO"
  | "SALA"
  | "GALPAO";

export type PropertyTypePT =
  | "Casa"
  | "Apartamento"
  | "Comercial"
  | "Terreno"
  | "Sala"
  | "Galpão";

/**
 * Mapeamentos bidirecional status ↔ PT
 */
export const PROPERTY_STATUS_MAP: Record<PropertyStatus, PropertyStatusPT> = {
  DISPONIVEL: "Disponível",
  ALUGADO:    "Alugado",
  MANUTENCAO: "Manutenção",
  INATIVO:    "Inativo",
};

export const PROPERTY_STATUS_MAP_REVERSE: Record<PropertyStatusPT, PropertyStatus> = {
  "Disponível": "DISPONIVEL",
  "Alugado":    "ALUGADO",
  "Manutenção": "MANUTENCAO",
  "Inativo":    "INATIVO",
};

export const PROPERTY_TYPE_MAP: Record<PropertyType, PropertyTypePT> = {
  CASA:        "Casa",
  APARTAMENTO: "Apartamento",
  COMERCIAL:   "Comercial",
  TERRENO:     "Terreno",
  SALA:        "Sala",
  GALPAO:      "Galpão",
};

/**
 * Documento anexado ao imóvel
 */
export interface PropertyDocument {
  id: string;
  name: string;
  url: string;
  createdAt?: string;
}

/**
 * Entidade completa retornada pela API
 */
export interface Property {
  id: string;
  title: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  status: PropertyStatus;
  type?: PropertyType;
  documents?: PropertyDocument[];
  tenantId: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * DTO para criação
 */
export interface CreatePropertyDTO {
  title: string;
  description?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  price?: number;
  status?: PropertyStatus;
  type?: PropertyType;
}

/**
 * DTO para atualização parcial
 */
export type UpdatePropertyDTO = Partial<CreatePropertyDTO>;

/**
 * Modelo de exibição na UI (tabelas, cards, listas)
 * Campos pré-formatados para evitar lógica nos componentes
 */
export interface PropertyUI {
  id: string;
  title: string;
  addressText: string;    // "Rua X, 123 - Bairro, Cidade/UF"
  cep?: string;
  price: number;
  priceFormatted: string; // "R$ 2.500,00"
  status: PropertyStatusPT;
  statusRaw: PropertyStatus;
  type: PropertyTypePT;
  typeRaw?: PropertyType;
  description?: string;
  documents?: PropertyDocument[];
  createdAt?: string;
}
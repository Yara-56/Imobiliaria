import {
    Property,
    PropertyUI,
    PropertyStatusPT,
    PropertyType,
    PROPERTY_STATUS_MAP,
    PROPERTY_STATUS_MAP_REVERSE,
    PROPERTY_TYPE_MAP
  } from "@/features/properties/types/property.js";
  
  /**
   * Normaliza string removendo espaços e evitando null/undefined
   */
  const clean = (v?: any): string | undefined =>
    typeof v === "string" ? v.trim() : v ?? undefined;
  
  /**
   * Formata valores numéricos como moeda BRL
   */
  const formatBRL = (value?: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value ?? 0);
  
  /**
   * Constrói um endereço amigável
   */
  const buildAddressText = (p: Property): string =>
    [p.address, p.city, p.state].filter(Boolean).join(", ");
  
  /**
   * BACKEND → FRONTEND
   * Converte Property (API) para PropertyUI (tela)
   */
  export const mapApiToProperty = (p: Property): PropertyUI => ({
    id: p.id,
    title: clean(p.title)!,
    description: clean(p.description),
    addressText: buildAddressText(p),
    cep: clean(p.zipCode),
    price: p.price ?? 0,
    priceFormatted: formatBRL(p.price),
    statusRaw: p.status,
    status: PROPERTY_STATUS_MAP[p.status],
    typeRaw: p.type,
    type: p.type ? PROPERTY_TYPE_MAP[p.type] : "Casa",
    documents: p.documents ?? [],
    createdAt: p.createdAt,
  });
  
  /**
   * FRONTEND → BACKEND
   * Converte PropertyUI (tela) para Property (API)
   */
  export const mapPropertyToApi = (
    dto: Partial<PropertyUI>
  ): Partial<Property> => ({
    title: clean(dto.title),
    description: clean(dto.description),
    zipCode: clean(dto.cep),
    address: dto.addressText?.split(",")[0],
    price: dto.price,
  
    status:
      dto.statusRaw ??
      (dto.status
        ? PROPERTY_STATUS_MAP_REVERSE[dto.status as PropertyStatusPT]
        : undefined),
  
    type:
      dto.typeRaw ??
      (dto.type
        ? (Object.entries(PROPERTY_TYPE_MAP).find(
            ([, label]) => label === dto.type
          )?.[0] as PropertyType)
        : undefined),
  });
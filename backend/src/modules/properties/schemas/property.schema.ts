import { z } from "zod";

/**
 * 🧱 Schema Base para Imóveis
 * (Obs.: anexos via multer ficam em req.files — não entram aqui no body)
 */
const propertyBody = z.object({
  title: z
    .string()
    .trim()
    .min(5, "O título deve ter no mínimo 5 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .trim()
    .min(10, "A descrição deve ser mais detalhada"),

  price: z.coerce.number().positive("O preço deve ser um valor positivo"),

  type: z.enum(["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"], {
    message: "Escolha um tipo válido: APARTMENT, HOUSE, COMMERCIAL ou LAND",
  }),

  // ✅ Endereço completo (alinhado ao model atualizado)
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    complement: z.string().trim().optional(),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado é obrigatório"),
    zipCode: z.string().min(8, "CEP inválido"),
  }),

  // ✅ Campo opcional (se vocês realmente usam)
  sqls: z.string().trim().optional(),

  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  area: z.coerce.number().positive().optional(),
});

/**
 * 🚀 Schema para Criação
 */
export const createPropertySchema = z.object({
  body: propertyBody,
});

/**
 * 🔄 Schema para Atualização (parcial)
 */
export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID do imóvel inválido"),
  }),
  body: propertyBody.partial(),
});

/**
 * 🔍 Schema para Busca/Deleção
 */
export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID do imóvel inválido"),
  }),
});

// Tipagens para os Controllers
export type CreatePropertyInput = z.infer<typeof createPropertySchema>["body"];
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>["body"];

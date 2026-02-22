import { z } from "zod";

/**
 * 🧱 Schema Base para Imóveis
 */
const propertyBody = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(10),
  price: z.coerce.number().positive(),
  type: z.enum(["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"]),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    city: z.string().min(1),
    state: z.string().length(2),
    zipCode: z.string().min(8),
    complement: z.string().optional().nullable(),
  }),
  bedrooms: z.coerce.number().int().nonnegative().default(0),
  bathrooms: z.coerce.number().int().nonnegative().default(0),
  area: z.coerce.number().positive().optional(),
  sqls: z.string().trim().optional(),
});

/* ======================================================
   🚀 EXPORTAÇÃO DOS SCHEMAS (PARA AS ROTAS)
====================================================== */

export const createPropertySchema = z.object({
  body: propertyBody,
});

// ✅ CORREÇÃO: Aplicando o .partial() no SCHEMA do Zod antes de exportar
export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
  body: propertyBody.partial(), // Aqui o Zod entende que os campos são opcionais no PATCH
});

export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});

/* ======================================================
   🔢 EXPORTAÇÃO DAS TIPAGENS (PARA O CONTROLLER)
====================================================== */

// ✅ RESOLVE TS(2339): Usando o utilitário Partial do TS ou inferindo do schema parcial
export type CreatePropertyInput = z.infer<typeof propertyBody>;
export type UpdatePropertyInput = z.infer<ReturnType<typeof propertyBody.partial>>;
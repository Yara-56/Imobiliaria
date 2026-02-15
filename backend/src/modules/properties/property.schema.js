import { z } from "zod";

// Schema base para reutilização
const propertyBody = z.object({
  title: z.string().min(5, "O título deve ter no mínimo 5 caracteres").max(100),
  description: z.string().min(10, "Descrição muito curta"),
  price: z.number().positive("O preço deve ser um valor positivo"),
  type: z.enum(["APARTMENT", "HOUSE", "COMMERCIAL", "LAND"], {
    errorMap: () => ({ message: "Tipo de imóvel inválido" }),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

export const createPropertySchema = z.object({
  body: propertyBody,
});

export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID do imóvel inválido (Formato MongoDB)"),
  }),
  body: propertyBody.partial(), // No update, os campos são opcionais
});

export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});
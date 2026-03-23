import { z } from "zod";

const propertyDocumentBody = z.object({
  fileName: z.string().trim().min(1).optional(),
  originalName: z.string().trim().min(1).optional(),
  fileUrl: z.string().trim().min(1).optional(),
  storageKey: z.string().trim().min(1).optional(),
  mimeType: z.string().trim().optional().nullable(),
  size: z.coerce.number().int().nonnegative().optional().nullable(),

  // compatibilidade com formato antigo
  filename: z.string().trim().min(1).optional(),
  url: z.string().trim().min(1).optional(),
});

// ✅ Schema para documentos existentes — só precisa do ID
const existingDocumentBody = z.object({
  id: z.string().min(1),
});

const documentsSchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return [value];
  return value;
}, z.array(propertyDocumentBody).optional());

// ✅ Normaliza existingDocuments — pode vir como JSON string ou array
const existingDocumentsSchema = z.preprocess((value) => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === "string") {
    if (value.trim() === "") return undefined;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(value)) return value;
  if (typeof value === "object") return [value];

  return undefined;
}, z.array(existingDocumentBody).optional());

const propertyBody = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome/título deve ter pelo menos 3 caracteres")
    .max(120),

  city: z
    .string()
    .trim()
    .min(1, "Cidade é obrigatória")
    .max(100),

  state: z
    .string()
    .trim()
    .min(2, "Estado é obrigatório")
    .max(2, "Use a sigla do estado com 2 caracteres")
    .transform((value) => value.toUpperCase()),

  zipCode: z
    .string()
    .trim()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido"),

  street: z
    .string()
    .trim()
    .min(1, "Rua é obrigatória")
    .max(150),

  neighborhood: z
    .string()
    .trim()
    .min(1, "Bairro é obrigatório")
    .max(100),

  number: z
    .string()
    .trim()
    .min(1, "Número é obrigatório")
    .max(20),

  sqls: z
    .string()
    .trim()
    .min(1, "SQLS é obrigatório")
    .max(100),

  status: z
    .enum(["DISPONIVEL", "ALUGADO", "MANUTENCAO", "INATIVO"])
    .optional()
    .default("DISPONIVEL"),

  documents: documentsSchema,

  // ✅ Campo novo para documentos que já existem no banco e devem ser mantidos
  existingDocuments: existingDocumentsSchema,
});

const propertyUpdateBody = propertyBody.partial();

export const createPropertySchema = z.object({
  body: propertyBody,
});

export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
  body: propertyUpdateBody,
});

export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});

export type CreatePropertyInput = z.infer<typeof propertyBody>;
export type UpdatePropertyInput = z.infer<typeof propertyUpdateBody>;
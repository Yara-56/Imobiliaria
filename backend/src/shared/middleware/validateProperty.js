import { z } from "zod";

const propertySchema = z.object({
  cep: z.string()
    .min(8, "CEP deve ter no mínimo 8 caracteres")
    .max(9, "CEP deve ter no máximo 9 caracteres (formato 00000-000)")
    .regex(/^\d{5}-?\d{3}$/, "CEP deve estar no formato 00000-000"),
  sqls: z.string().max(20, "SQLS deve ter no máximo 20 caracteres").optional().nullable(),
  street: z.string().min(2, "Rua é obrigatória").max(80, "Rua muito longa"),
  number: z.string().min(1, "Número é obrigatório").max(10, "Número muito longo"),
  district: z.string().min(2, "Bairro é obrigatório").max(60, "Bairro muito longo"),
  city: z.string().min(2, "Cidade é obrigatória").max(60, "Cidade muito longa"),
  state: z.string().min(2, "Estado é obrigatório").max(30, "Nome de estado muito longo"),
  status: z.enum(["Available", "Occupied", "Under Maintenance"]).optional(),
  documents: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
});

export const validateCreate = (req, res, next) => {
  const parsed = propertySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  next();
};

export const validateUpdate = (req, res, next) => {
  const parsed = propertySchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  next();
};

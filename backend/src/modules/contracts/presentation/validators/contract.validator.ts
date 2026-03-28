import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// Métodos aceitos pelo prisma no Contract.paymentMethod
const paymentMethodEnum = [
  "PIX",
  "BOLETO",
  "CARTAO",
  "TRANSFERENCIA",
  "DINHEIRO"
] as const;

export const contractSchema = z.object({
  propertyId: z
    .string({ required_error: "propertyId é obrigatório." })
    .uuid("propertyId inválido."),

  renterId: z
    .string({ required_error: "renterId é obrigatório." })
    .uuid("renterId inválido."),

  rentAmount: z
    .number({ invalid_type_error: "rentAmount deve ser numérico." })
    .positive("O valor do aluguel deve ser maior que zero."),

  dueDay: z
    .number({ invalid_type_error: "dueDay deve ser numérico." })
    .int("Dia de vencimento deve ser inteiro.")
    .min(1)
    .max(31),

  startDate: z.coerce
    .date({ required_error: "startDate é obrigatório." })
    .refine((d) => !isNaN(d.getTime()), "startDate inválido."),

  endDate: z
    .union([z.coerce.date(), z.literal(null), z.undefined()])
    .refine(
      (d) => !d || !isNaN(new Date(d).getTime()),
      "endDate inválida."
    ),

  depositValue: z
    .number()
    .positive()
    .nullable()
    .optional(),

  paymentMethod: z.enum(paymentMethodEnum, {
    required_error: "paymentMethod é obrigatório.",
    invalid_type_error: "Método de pagamento inválido.",
  }),

  contractNumber: z
    .string()
    .min(1)
    .optional(),

  notes: z
    .string()
    .max(2000, "Notas devem ter no máximo 2000 caracteres.")
    .optional(),
});

// Express middleware
export const validateContractCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = contractSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: "error",
      message: "Erro de validação.",
      errors: parsed.error.errors.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  req.body = parsed.data; // Normalizado e seguro
  next();
};
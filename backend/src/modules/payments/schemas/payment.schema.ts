import { z } from "zod";

/**
 * ✅ Schema de Pagamentos (Versão Definitiva)
 * Sincronizado com o MongoDB e livre de erros de sobrecarga do TS.
 */
export const createPaymentSchema = z.object({
  body: z.object({
    // 🛡️ IDs - Usamos .min(1) para garantir que não venha vazio
    contractId: z.string().min(1, "O ID do contrato é obrigatório"),
    tenantId: z.string().min(1, "O inquilino é obrigatório"),

    // 💸 Valores - Validação numérica simples e eficaz
    amount: z.number().positive("O valor deve ser maior que zero"),

    // 📅 Datas - O 'coerce' transforma a string do front em objeto Date
    paymentDate: z.coerce.date(),

    // 🏷️ Categorias - Simplificado para evitar erro de sobrecarga no error_map
    method: z.enum(['Pix', 'Boleto', 'Cartão', 'Dinheiro', 'Transferência']),

    status: z.enum(['Pendente', 'Pago', 'Atrasado']).default('Pendente'),

    // 📅 Mês de Referência (MM/AAAA) - Fundamental para o controle financeiro
    referenceMonth: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "Use o formato MM/AAAA (Ex: 02/2026)"),

    // 📄 Suporte para o PDF do comprovante
    receiptUrl: z.string().url("URL do comprovante inválida").optional().or(z.literal("")),
    
    notes: z.string().max(500, "Limite de 500 caracteres").optional(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>["body"];
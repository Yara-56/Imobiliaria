// schemas/tenant.schema.ts

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────
const onlyNumbers = (v: string) => v.replace(/\D/g, "");
const normalizeString = (v: string) => v.trim();
const normalizeEmail = (v: string) => v.trim().toLowerCase();

// ─────────────────────────────────────────────────────────────
// Validações reais
// ─────────────────────────────────────────────────────────────
const isValidCPF = (cpf: string) => {
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;

  return rest === parseInt(cpf.substring(10, 11));
};

const isValidCNPJ = (cnpj: string) => {
  if (!cnpj || cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  const digits = cnpj.substring(length);

  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length += 1;
  numbers = cnpj.substring(0, length);

  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === parseInt(digits.charAt(1));
};

const isValidDocument = (doc: string) => {
  return doc.length === 11
    ? isValidCPF(doc)
    : doc.length === 14
    ? isValidCNPJ(doc)
    : false;
};

// ─────────────────────────────────────────────────────────────
// Enum
// ─────────────────────────────────────────────────────────────
export const paymentMethodEnum = z.enum(["PIX", "BOLETO", "DINHEIRO"]);

// ─────────────────────────────────────────────────────────────
// Schema principal
// ─────────────────────────────────────────────────────────────
export const tenantFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Mínimo de 3 caracteres")
    .transform(normalizeString),

  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .transform(normalizeEmail),

  phone: z
    .string()
    .optional()
    .transform((v) => onlyNumbers(v || ""))
    .refine((v) => v === "" || v.length >= 10, {
      message: "Telefone inválido (mínimo 10 dígitos)",
    }),

  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .transform(onlyNumbers)
    .refine((v) => v.length === 11 || v.length === 14, {
      message: "CPF (11) ou CNPJ (14) inválido",
    })
    .refine((v) => isValidDocument(v), {
      message: "Documento inválido",
    }),

  // ✅ CORRIGIDO AQUI
  rentValue: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0, "Valor não pode ser negativo")
  ),

  // ✅ CORRIGIDO AQUI
  billingDay: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(1, "Mínimo 1").max(31, "Máximo 31")
  ),

  preferredPaymentMethod: paymentMethodEnum,
});

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
export type TenantFormData = z.infer<typeof tenantFormSchema>;
export type TenantFormInput = z.input<typeof tenantFormSchema>;

// ─────────────────────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────────────────────
export const DEFAULT_TENANT_VALUES: TenantFormInput = {
  fullName: "",
  email: "",
  phone: "",
  document: "",
  rentValue: 0,
  billingDay: 1,
  preferredPaymentMethod: "PIX",
};
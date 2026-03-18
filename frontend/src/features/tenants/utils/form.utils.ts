// schemas/tenant.schema.ts

import { z } from "zod";
import type { Tenant, CreateTenantDTO } from "../types/tenant.types";

/**
 * 🛡️ UTILITÁRIOS
 */
const onlyNumbers = (value: string) => value.replace(/\D/g, "");

/**
 * 🇧🇷 VALIDAÇÃO CPF
 */
const validateCPF = (cpf: string): boolean => {
  const clean = onlyNumbers(cpf);

  if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
  }

  rest = (sum * 10) % 11;
  if (rest >= 10) rest = 0;

  if (rest !== parseInt(clean.substring(9, 10))) return false;

  sum = 0;

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
  }

  rest = (sum * 10) % 11;
  if (rest >= 10) rest = 0;

  return rest === parseInt(clean.substring(10, 11));
};

/**
 * 🇧🇷 VALIDAÇÃO CNPJ
 */
const validateCNPJ = (cnpj: string): boolean => {
  const clean = onlyNumbers(cnpj);

  if (clean.length !== 14 || /^(\d)\1+$/.test(clean)) return false;

  let length = clean.length - 2;
  let numbers = clean.substring(0, length);
  const digits = clean.substring(length);

  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = clean.substring(0, length);

  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return result === parseInt(digits.charAt(1));
};

/**
 * 📱 TELEFONE BR
 */
const validatePhoneBR = (phone: string): boolean => {
  const clean = onlyNumbers(phone);
  return clean.length === 10 || clean.length === 11;
};

/**
 * 🧠 DOCUMENTO DINÂMICO (CPF ou CNPJ)
 */
const validateDocument = (doc: string): boolean => {
  const clean = onlyNumbers(doc);

  if (clean.length === 11) return validateCPF(clean);
  if (clean.length === 14) return validateCNPJ(clean);

  return false;
};

/**
 * 🎯 SCHEMA PRINCIPAL
 */
export const tenantFormSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Mínimo de 3 caracteres")
    .transform((v) => v.trim()),

  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .transform((v) => v.toLowerCase().trim()),

  phone: z
    .string()
    .transform((v) => onlyNumbers(v || ""))
    .refine((v) => v === "" || validatePhoneBR(v), {
      message: "Telefone inválido",
    }),

  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .transform((v) => onlyNumbers(v))
    .refine((v) => validateDocument(v), {
      message: "CPF ou CNPJ inválido",
    }),

  rentValue: z
    .number()
    .min(0, "Valor não pode ser negativo"),

  billingDay: z
    .number()
    .min(1, "Dia mínimo é 1")
    .max(31, "Dia máximo é 31"),
});

/**
 * 🧾 TIPOS
 */
// Tipo após as transformações (output) - o que o backend recebe
export type TenantFormData = z.infer<typeof tenantFormSchema>;

// Tipo antes das transformações (input) - o que o formulário usa
export type TenantFormInput = z.input<typeof tenantFormSchema>;

/**
 * 📦 DEFAULTS (FORM)
 */
export const DEFAULT_TENANT_VALUES: TenantFormInput = {
  fullName: "",
  email: "",
  phone: "",
  document: "",
  rentValue: 0,
  billingDay: 1,
};

/**
 * 🔄 MAPPERS (FORM ⇄ API)
 */
export const tenantMappers = {
  /**
   * API → FORM
   */
  toForm: (tenant: Tenant): TenantFormInput => ({
    fullName: tenant.fullName ?? "",
    email: tenant.email ?? "",
    phone: tenant.phone ?? "",
    document: tenant.document ?? "",
    rentValue: tenant.rentValue ?? 0,
    billingDay: tenant.billingDay ?? 1,
  }),

  /**
   * FORM → API (CREATE)
   */
  toPayload: (data: TenantFormData): CreateTenantDTO => ({
    ...data,

    // 🔥 Defaults de negócio (SaaS-ready)
    plan: "BASIC",
    preferredPaymentMethod: "PIX",
    autoUpdateContract: false,

    settings: {
      limits: {
        maxUsers: 1,
        maxProperties: 10,
      },
      features: {
        crm: true,
        automation: false,
      },
    },
  }),
};
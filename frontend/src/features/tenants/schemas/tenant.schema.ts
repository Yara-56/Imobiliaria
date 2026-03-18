// schemas/tenant.schema.ts

import { z } from "zod";

const onlyNumbers = (v: string) => v.replace(/\D/g, "");

/**
 * Schema de validação do formulário de inquilino
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
    .refine((v) => v === "" || v.length >= 10, {
      message: "Telefone inválido (mínimo 10 dígitos)",
    }),

  document: z
    .string()
    .min(1, "Documento é obrigatório")
    .transform((v) => onlyNumbers(v))
    .refine((v) => v.length === 11 || v.length === 14, {
      message: "CPF (11 dígitos) ou CNPJ (14 dígitos) inválido",
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
 * Tipo após as transformações (output) 
 * - É o que o backend recebe
 * - Usado no tipo de retorno do onSubmit
 */
export type TenantFormData = z.infer<typeof tenantFormSchema>;

/**
 * Tipo antes das transformações (input)
 * - É o que o formulário usa internamente
 * - Usado no useForm<TenantFormInput>
 */
export type TenantFormInput = z.input<typeof tenantFormSchema>;

/**
 * Valores padrão do formulário
 */
export const DEFAULT_TENANT_VALUES: TenantFormInput = {
  fullName: "",
  email: "",
  phone: "",
  document: "",
  rentValue: 0,
  billingDay: 1,
};
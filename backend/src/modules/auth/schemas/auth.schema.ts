import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido").trim().toLowerCase(),
    password: z.string().min(1, "A senha é obrigatória"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido").trim().toLowerCase(),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    companyName: z.string().min(2, "Nome da empresa é obrigatório"), // Para criar o tenant
  }),
});
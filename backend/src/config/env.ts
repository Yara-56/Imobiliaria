import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * 🔐 Schema de validação das variáveis de ambiente
 * - Transforma PORT para number
 * - Garante JWT mínimo seguro em produção
 * - Fail-fast se algo estiver errado
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .default("3001")
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), {
      message: "PORT deve ser um número válido",
    }),

  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI é obrigatória para conectar ao banco."),

  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL deve ser uma URL válida")
    .default("http://localhost:5173"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter no mínimo 32 caracteres."),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET deve ter no mínimo 32 caracteres."),
});

/**
 * 🔎 Parse seguro
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Erro nas variáveis de ambiente:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

/**
 * 🚀 Exportação imutável e tipada automaticamente
 */
export const env = Object.freeze({
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGO_URI,
  frontendUrl: parsed.data.FRONTEND_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
});

/**
 * 📌 Tipo automático inferido do schema
 */
export type Env = typeof env;

export default env;

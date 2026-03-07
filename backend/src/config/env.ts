import "dotenv/config";
import { z } from "zod";

/**
 * Schema das variáveis de ambiente
 */
const envSchema = z.object({

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3000),

  /**
   * Banco
   */
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL é obrigatória"),

  /**
   * JWT
   */
  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET muito curta"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(10, "JWT_REFRESH_SECRET muito curta"),

  JWT_EXPIRES_IN: z
    .string()
    .default("15m"),

  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default("7d"),

  /**
   * CORS
   */
  FRONTEND_URL: z
    .string()
    .default("http://localhost:5173"),

});

/**
 * Validação das variáveis
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {

  console.error("\n❌ Erro nas variáveis de ambiente:\n");

  console.error(parsed.error.format());

  console.error("\nCorrija o arquivo .env antes de iniciar o servidor.\n");

  process.exit(1);
}

/**
 * Variáveis validadas
 */
export const env = parsed.data;

/**
 * Helpers úteis
 */
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
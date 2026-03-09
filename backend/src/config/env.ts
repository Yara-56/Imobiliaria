import dotenvFlow from "dotenv-flow";
import { z } from "zod";

/**
 * Carrega automaticamente arquivos:
 *
 * .env
 * .env.development
 * .env.production
 * .env.test
 *
 * baseado no NODE_ENV
 */
dotenvFlow.config();

/**
 * Schema de validação das variáveis de ambiente
 */
const envSchema = z.object({

  /**
   * Ambiente da aplicação
   */
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /**
   * Porta da API
   */
  PORT: z
    .coerce
    .number()
    .default(3001),

  /**
   * URL de conexão do banco (MongoDB + Prisma)
   */
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL é obrigatória"),

  /**
   * JWT - Access Token
   */
  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET deve ter pelo menos 10 caracteres"),

  /**
   * JWT - Refresh Token
   */
  JWT_REFRESH_SECRET: z
    .string()
    .min(10, "JWT_REFRESH_SECRET deve ter pelo menos 10 caracteres"),

  /**
   * Expiração do Access Token
   */
  JWT_EXPIRES_IN: z
    .string()
    .default("15m"),

  /**
   * Expiração do Refresh Token
   */
  JWT_REFRESH_EXPIRES_IN: z
    .string()
    .default("7d"),

  /**
   * URL do frontend (CORS)
   */
  FRONTEND_URL: z
    .string()
    .url()
    .default("http://localhost:5173"),

  /**
   * Prefixo da API
   */
  API_PREFIX: z
    .string()
    .default("/api"),

  /**
   * Versão da API
   */
  API_VERSION: z
    .string()
    .default("v1"),

  /**
   * Nível de logs
   */
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

});

/**
 * Validação segura das variáveis
 */
const parsedEnv = envSchema.safeParse(process.env);

/**
 * Caso exista erro nas variáveis
 */
if (!parsedEnv.success) {

  console.error("\n❌ Erro nas variáveis de ambiente:\n");

  console.error(parsedEnv.error.format());

  console.error("\n⚠️ Corrija o arquivo .env antes de iniciar o servidor.\n");

  process.exit(1);
}

/**
 * Variáveis de ambiente validadas
 */
export const env = parsedEnv.data;

/**
 * Helpers úteis
 */
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

/**
 * URL base da API
 */
export const API_BASE = `${env.API_PREFIX}/${env.API_VERSION}`;

/**
 * Log opcional para desenvolvimento
 */
if (isDev) {

  console.log("\n🌱 Ambiente:", env.NODE_ENV);
  console.log("🚀 Porta:", env.PORT);
  console.log("🔗 API Base:", API_BASE);
  console.log("🌐 Frontend:", env.FRONTEND_URL);
  console.log("");

}
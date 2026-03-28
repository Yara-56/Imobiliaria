import dotenvFlow from "dotenv-flow";
import { z } from "zod";

dotenvFlow.config();

/**
 * 🔐 Schema de validação (NÍVEL PRODUÇÃO)
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL é obrigatória")
    .refine((url) => url.startsWith("mongodb"), {
      message: "DATABASE_URL deve ser MongoDB",
    }),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter no mínimo 32 caracteres 🔥"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET deve ter no mínimo 32 caracteres 🔥"),

  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL deve ser uma URL válida")
    .default("http://localhost:5173"),

  API_PREFIX: z.string().default("/api"),
  API_VERSION: z.string().default("v1"),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

/**
 * 🔍 Validação
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("\n❌ ERRO CRÍTICO NAS ENV:\n");
  console.error(parsed.error.format());
  process.exit(1);
}

/**
 * ✅ ENV TIPADO GLOBAL
 */
export const env = parsed.data;

/**
 * 🔥 FLAGS
 */
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

/**
 * 🌐 API BASE
 */
export const API_BASE = `${env.API_PREFIX}/${env.API_VERSION}`;

/**
 * 🧠 CONFIG CENTRAL (IMPORTANTE PRA LACERDA)
 */
export const appConfig = {
  apiBase: API_BASE,
  jwt: {
    accessExpiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origin: env.FRONTEND_URL,
  },
};

/**
 * 📊 LOG CONTROLADO
 */
if (isDev) {
  console.log("\n🌱 Ambiente:", env.NODE_ENV);
  console.log("🚀 Porta:", env.PORT);
  console.log("🔗 API:", API_BASE);
  console.log("🌐 Frontend:", env.FRONTEND_URL);
  console.log("");
}
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

  // ☁️ CLOUDINARY CONFIG (Adicionado para resolver o erro no Provider)
  CLOUDINARY_NAME: z.string().min(1, "Cloudinary Name é obrigatório"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary API Key é obrigatória"),
  CLOUDINARY_API_SECRET: z.string().min(1, "Cloudinary API Secret é obrigatória"),
  CLOUDINARY_FOLDER_PREFIX: z.string().default("imobiliaria_dev"),

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
  // Exibe os erros de forma mais legível no console
  console.error(JSON.stringify(parsed.error.format(), null, 2));
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
 * 🧠 CONFIG CENTRAL
 */
export const appConfig = {
  apiBase: API_BASE,
  jwt: {
    accessExpiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cloudinary: {
    name: env.CLOUDINARY_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    folderPrefix: env.CLOUDINARY_FOLDER_PREFIX,
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
  console.log("☁️ Cloudinary Prefix:", env.CLOUDINARY_FOLDER_PREFIX);
  console.log("");
}
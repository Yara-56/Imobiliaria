import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/* ==================================================
   🔐 SCHEMA DE VALIDAÇÃO
================================================== */

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

  /* ===============================
     🗄️ DATABASE
  =============================== */
  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI é obrigatória."),

  /* ===============================
     🌐 FRONTEND (CORS)
  =============================== */
  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL deve ser uma URL válida")
    .default("http://localhost:5173"),

  /* ===============================
     🔐 JWT
  =============================== */
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET deve ter no mínimo 32 caracteres."),

  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET deve ter no mínimo 32 caracteres."),

  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  /* ===============================
     📧 MAIL
  =============================== */
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
});

/* ==================================================
   🔎 PARSE + FAIL FAST
================================================== */

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Erro nas variáveis de ambiente:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

/* ==================================================
   🚀 EXPORT IMUTÁVEL
================================================== */

export const env = Object.freeze({
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,

  mongoUri: parsed.data.MONGO_URI,

  frontendUrl: parsed.data.FRONTEND_URL,

  jwtSecret: parsed.data.JWT_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,

  mail: {
    host: parsed.data.MAIL_HOST,
    port: parsed.data.MAIL_PORT,
    user: parsed.data.MAIL_USER,
    pass: parsed.data.MAIL_PASS,
  },
});

export type Env = typeof env;

export default env;

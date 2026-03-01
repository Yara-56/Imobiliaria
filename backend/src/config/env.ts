import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().default(3001),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL é obrigatória"),

  JWT_SECRET: z
    .string()
    .min(10, "JWT_SECRET muito curta"),

  JWT_REFRESH_SECRET: z
    .string()
    .min(10, "JWT_REFRESH_SECRET muito curta"),

  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
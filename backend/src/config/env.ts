import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("3001"), 
  MONGO_URI: z.string({ message: "MONGO_URI é obrigatória" }), // Alterado para 'message'
  FRONTEND_URL: z.string().optional(),
  // 🔑 Chaves para o JWT validadas
  JWT_SECRET: z.string({ message: "JWT_SECRET é essencial para a segurança" }),
  JWT_REFRESH_SECRET: z.string({ message: "JWT_REFRESH_SECRET é necessário" }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Erro de configuração:");
  console.error(parsed.error.format());
  process.exit(1);
}

// Exportação com os campos reconhecidos pelo seu middleware
export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: Number(parsed.data.PORT),
  mongoUri: parsed.data.MONGO_URI,
  frontendUrl: parsed.data.FRONTEND_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtRefreshSecret: parsed.data.JWT_REFRESH_SECRET,
};
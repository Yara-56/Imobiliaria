import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

/**
 * 📝 Esquema de Validação (Zod)
 * Validamos as strings e definimos mensagens de erro claras para o terminal.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3001"), 
  
  MONGO_URI: z.string({ 
    message: "MONGO_URI é obrigatória para conectar ao banco de dados." 
  }),
  
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  
  JWT_SECRET: z.string({ 
    message: "JWT_SECRET não foi informada. A segurança do sistema depende dela." 
  }),
  
  JWT_REFRESH_SECRET: z.string({ 
    message: "JWT_REFRESH_SECRET é necessária para a renovação de tokens." 
  }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Erro de configuração das variáveis de ambiente:");
  console.error(_env.error.format());
  process.exit(1);
}

/**
 * 🚀 Exportação Tipada e Imutável
 * O uso do 'as const' garante que o TypeScript saiba que estes valores não mudam,
 * resolvendo problemas de tipagem nos middlewares que importam este arquivo.
 */
export const env = {
  nodeEnv: _env.data.NODE_ENV,
  port: Number(_env.data.PORT),
  mongoUri: _env.data.MONGO_URI,
  frontendUrl: _env.data.FRONTEND_URL,
  jwtSecret: _env.data.JWT_SECRET,
  jwtRefreshSecret: _env.data.JWT_REFRESH_SECRET,
} as const;

export default env;
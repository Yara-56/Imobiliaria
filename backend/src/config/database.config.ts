import { PrismaClient } from "@prisma/client";
// ✅ Mudamos para caminho relativo para o VS Code parar de dar erro de 'módulo não encontrado'
import { env } from "./env.js"; 
import { logger } from "../shared/utils/logger.js";

/**
 * 💡 Padrão Singleton para o Prisma:
 * Evita criar múltiplas conexões com o MongoDB durante o 'hot reload' do nodemon.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * 🍃 Conexão explícita com o banco de dados
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("🍃 Prisma conectado com sucesso ao MongoDB!");
  } catch (error) {
    logger.error({ err: error }, "❌ Erro crítico ao conectar no MongoDB. Verifique se o banco está rodando e a DATABASE_URL no .env");
    
    // Encerra o processo se não houver banco, pois a API não funciona sem ele
    process.exit(1);
  }
};
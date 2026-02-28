import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

/**
 * 🎯 Evita múltiplas instâncias do Prisma no ambiente de desenvolvimento
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * 📦 Instância única do Prisma (Singleton Pattern)
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * 🔐 Conexão com o banco via Prisma
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();

    logger.info("🍃 Prisma conectado com sucesso ao MongoDB!");
  } catch (error) {
    logger.fatal({ err: error }, "❌ Erro ao conectar no banco de dados");
    process.exit(1); // Fail-fast
  }
};
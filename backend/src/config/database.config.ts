// CAMINHO: backend/src/config/database.config.ts

import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

/**
 * 🎯 Instância única do Prisma (Singleton)
 * Evita múltiplas conexões no ambiente de desenvolvimento
 */
export const prisma = new PrismaClient({
  log:
    env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

/**
 * 🔐 Conexão com o banco via Prisma
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();

    logger.info("🍃 Prisma conectado com sucesso ao MongoDB!");
  } catch (error) {
    logger.fatal({ err: error }, "❌ Erro ao conectar no banco de dados");
    process.exit(1); // Fail-fast (boa prática)
  }
};
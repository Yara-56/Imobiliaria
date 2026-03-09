import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

/**
 * 🗄️ DATABASE CONFIGURATION
 * Professional Singleton Pattern
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * 🛠️ TIPAGEM DE LOGS
 * Definimos os tipos manualmente para garantir compatibilidade total 
 * com o Prisma v6.19.2.
 */
type LogLevel = 'query' | 'info' | 'warn' | 'error';

const prismaLogs: LogLevel[] =
  env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : ["error"];

/**
 * Instância Única do Prisma
 */
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: prismaLogs,
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * 🔌 CICLO DE VIDA DO BANCO
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info("🔌 Conectando ao banco de dados...");
    await prisma.$connect();
    logger.info("🍃 Banco conectado com sucesso!");
  } catch (error) {
    logger.error({ err: error }, "❌ Falha ao conectar ao banco. Verifique o DATABASE_URL.");
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info("🔌 Banco desconectado");
  } catch (error) {
    logger.error({ err: error }, "❌ Erro ao desconectar do banco");
  }
};

export const setupDatabaseShutdown = (): void => {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "🛑 Encerrando aplicação e conexões...");
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

export const databaseConfig = {
  prisma,
  connectDatabase,
  disconnectDatabase,
  setupDatabaseShutdown,
};
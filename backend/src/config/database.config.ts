import { PrismaClient, Prisma } from "@prisma/client";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

/**
 * Evita múltiplas instâncias do Prisma durante hot reload
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Configuração de logs do Prisma
 */
const prismaLogs: Prisma.LogLevel[] =
  env.NODE_ENV === "development"
    ? ["query", "info", "warn", "error"]
    : ["error"];

/**
 * Instância única do Prisma
 */
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: prismaLogs,
  });

/**
 * Salva instância global em desenvolvimento
 */
if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Conectar ao banco
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info("🔌 Conectando ao banco de dados...");

    await prisma.$connect();

    logger.info("🍃 Banco conectado com sucesso!");
  } catch (error) {
    logger.error(
      { err: error },
      "❌ Falha ao conectar ao banco. Verifique DATABASE_URL."
    );

    process.exit(1);
  }
};

/**
 * Desconectar banco
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info("🔌 Banco desconectado");
  } catch (error) {
    logger.error(
      { err: error },
      "❌ Erro ao desconectar banco"
    );
  }
};

/**
 * Shutdown gracioso da aplicação
 */
export const setupDatabaseShutdown = (): void => {
  const shutdown = async (signal: string) => {
    logger.info({ signal }, "🛑 Encerrando aplicação...");
    await disconnectDatabase();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

/**
 * Export da configuração
 */
export const databaseConfig = {
  prisma,
  connectDatabase,
  disconnectDatabase,
  setupDatabaseShutdown,
};
import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { logger } from "../../shared/utils/logger.js";

/**
 * 🔗 AuraImobi Database Engine
 * Gerencia a conexão com o MongoDB com foco em resiliência e alta disponibilidade.
 */
const connectDB = async (): Promise<void> => {
  try {
    // 🛡️ Segurança de Consulta: Impede que campos não definidos no Schema sejam usados em queries
    mongoose.set("strictQuery", true);

    // ⚙️ Configurações de Conexão Profissional
    const connectionOptions = {
      autoIndex: true, // Cria índices automaticamente (ideal para dev)
      maxPoolSize: 10, // Limita o número de conexões simultâneas para poupar recursos do servidor
      serverSelectionTimeoutMS: 5000, // Desiste após 5s se o banco estiver fora do ar
      socketTimeoutMS: 45000, // Fecha sockets inativos após 45s
    };

    const conn = await mongoose.connect(env.mongoUri, connectionOptions);

    logger.info(`🍃 MongoDB Conectado: ${conn.connection.host}`);
    
    // Identifica se estamos rodando na nuvem ou local
    if (env.nodeEnv === "development") {
      logger.info(`📊 Banco de Dados ativo: ${conn.connection.name}`);
    }

  } catch (error) {
    logger.error("❌ Erro fatal ao conectar no MongoDB:");
    if (error instanceof Error) {
      logger.error(`Mensagem: ${error.message}`);
    }
    
    // Em produção, nunca deixe o servidor rodando sem banco de dados
    process.exit(1);
  }

  /**
   * 📡 Event Listeners de Conectividade
   * Essencial para Cybersecurity e Disponibilidade
   */
  mongoose.connection.on("error", (err) => {
    logger.error(`💥 Erro de runtime no MongoDB: ${err}`);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ Conexão com MongoDB perdida. O Mongoose tentará reconectar automaticamente.");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("♻️ Conexão com MongoDB restabelecida com sucesso.");
  });
};

export default connectDB;
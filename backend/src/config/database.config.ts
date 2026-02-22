// CAMINHO: backend/src/config/database.config.ts
import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../shared/utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    /**
     * 🔐 Conexão Segura
     * Usamos env.DATABASE_URL (ajustado no passo anterior para bater com o .env)
     */
    await mongoose.connect(env.DATABASE_URL, {
      autoIndex: true, // Recomendado em development para criar índices do Mongoose
      maxPoolSize: 10, // Cybersecurity: Limita conexões para evitar DoS no banco
      serverSelectionTimeoutMS: 5000, // Timeout após 5s se o MongoDB estiver offline
    });

    // Usando o logger que você já tem no projeto em vez de console.log
    logger.info("🍃 MongoDB conectado com sucesso ao ImobiSys!");
    
  } catch (error) {
    logger.fatal({ err: error }, "❌ Erro ao conectar no banco de dados");
    process.exit(1); // Encerra o processo se não houver banco (Bootstrap fail)
  }
};
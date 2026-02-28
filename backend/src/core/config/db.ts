import mongoose from "mongoose";
import { env } from "../../config/env.js"; // Verifique se o caminho sobe os níveis certos
import { logger } from "../../shared/utils/logger.js";

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", true);

    const connectionOptions = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // ✅ CORREÇÃO: Usando os nomes que o seu TS reconhece
    const conn = await mongoose.connect(env.DATABASE_URL, connectionOptions);

    logger.info(`🍃 MongoDB Conectado: ${conn.connection.host}`);

    // ✅ CORREÇÃO: Usando NODE_ENV em maiúsculas
    if (env.NODE_ENV === "development") {
      logger.info(`📊 Banco de Dados ativo: ${conn.connection.name}`);
    }
  } catch (error) {
    logger.error("❌ Erro fatal ao conectar no MongoDB:");
    if (error instanceof Error) {
      logger.error(`Mensagem: ${error.message}`);
    }
    process.exit(1);
  }
  
  // Listeners...
};

export default connectDB;
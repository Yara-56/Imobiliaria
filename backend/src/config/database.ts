import mongoose from "mongoose";
import { env } from "./env.ts";

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    await mongoose.connect(env.mongoUri, options);
    console.log("🍃 MongoDB Conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => console.error(`🔴 Erro no MongoDB: ${err}`));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB desconectado."));

export default connectDatabase;
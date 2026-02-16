import mongoose from "mongoose";
import { env } from "../../config/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("📦 MongoDB conectado");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

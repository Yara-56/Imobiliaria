import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

// ✅ CORREÇÃO ts(2834): Adicionando a extensão .ts obrigatória para NodeNext
// ✅ CORREÇÃO ts(2305): Usando importação nomeada com { } para dar match com o seu export
import { apiRouter } from "./shared/routes/index.js";

const app = express();

/**
 * 🌐 MIDDLEWARES
 */
app.use(
  cors({
    origin: "http://localhost:5173", // URL do seu Vite
    credentials: true,
  })
);
app.use(express.json());

/**
 * 🚀 ROTAS PRINCIPAIS
 * Centralizando tudo através do apiRouter em /api/v1
 */
app.use("/api/v1", apiRouter);

/**
 * 🗄️ CONEXÃO E BOOTSTRAP
 */
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("🔥 Conectado ao MongoDB - AuraImobi");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
  });

export default app;

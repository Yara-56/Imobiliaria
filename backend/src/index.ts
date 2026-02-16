import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import tenantRoutes from "./routes/tenants";

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("🔥 Conectado ao MongoDB");
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));
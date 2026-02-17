import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Removi o .js dos imports para evitar conflito com o tsx
import { env } from "../src/config/env";
import User from "../src/modules/users/user.model";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function createAdmin(): Promise<void> {
  try {
    console.log("🔌 Conectando ao MongoDB...");
    await mongoose.connect(env.mongoUri);

    const email = "admin@admin.com";
    const password = "123456";
    const tenantId = "default";

    // 🔴 PASSO CHAVE: Remove o admin antigo se ele existir para limpar erros de senha/status
    console.log("🧹 Limpando registros antigos...");
    await User.deleteOne({ email });

    console.log("🚀 Criando novo administrador...");
    const newAdmin = new User({
      name: "Administrador",
      email,
      password, // O seu model deve ter um pre("save") para fazer o hash
      role: "admin",
      tenantId,
      status: "ativo",
    });

    await newAdmin.save();

    console.log("✅ Admin criado com sucesso!");
    console.log("📧 Email:", email);
    console.log("🔑 Senha:", password);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar admin:");
    if (error instanceof Error) console.error(error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void createAdmin();
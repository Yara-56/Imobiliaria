import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/modules/users/user.model";

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/imobiliaria";
    
    await mongoose.connect(mongoUri);
    console.log("🔋 Conectado ao MongoDB para criação do Admin...");

    const adminEmail = "admin@imobisys.com";
    const plainPassword = "Admin123";

    // Criptografia essencial para segurança
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Limpa registros anteriores para evitar erro de duplicata
    await User.deleteOne({ email: adminEmail });

    const admin = new User({
      name: "Yara Administradora",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
      // O campo 'status' será preenchido automaticamente pelo Mongoose
    });

    await admin.save();
    
    console.log("------------------------------------------");
    console.log("✅ USUÁRIO ADMIN CRIADO COM SUCESSO!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${plainPassword}`);
    console.log("------------------------------------------");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
    process.exit(1);
  }
};

seedAdmin();
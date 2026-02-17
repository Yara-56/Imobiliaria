import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "./src/modules/users/user.model.js";
import Property from "./src/modules/properties/property.model.js";

const seedDatabase = async () => {
  try {
    // 1. Conexão
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/imobiliaria");
    console.log("🔋 Conectado ao MongoDB!");

    // 2. Limpeza
    await User.deleteMany({});
    await Property.deleteMany({});

    const hashedPassword = await bcrypt.hash("Admin123!", 10);

    // 3. Criar Admin (Consertando o erro 'password is required')
    const admin = await User.create({
      name: "Yara Founders",
      email: "admin@auraimobi.com",
      password: hashedPassword,
      role: "admin",
      tenantId: "aura_main"
    });

    // 4. Criar Imóvel (Consertando o erro 'title', 'price' e 'address' required)
    await Property.create({
      title: "Mansão Aura Itaim",
      description: "Luxo e sofisticação no coração de SP.",
      price: 15000,
      type: "ALUGUEL",
      address: {
        street: "Rua Amauri",
        number: "100",
        city: "São Paulo",
        state: "SP",
        zipCode: "01448-000" // Campo exigido pelo seu terminal!
      },
      owner: admin._id,
      tenantId: "aura_main",
      status: "Disponível"
    });

    console.log("💎 AuraImobi: Banco populado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  }
};

seedDatabase();
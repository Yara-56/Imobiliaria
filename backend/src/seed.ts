import mongoose from "mongoose";
import { env } from "./config/env.js"; 
import User from "./modules/auth/models/user.model.js"; 
import Property from "./modules/properties/models/property.model.js";
import Contract from "./modules/contracts/models/contract.model.js";

const TRIAL_TENANT_ID = "507f1f77bcf86cd799439011"; 

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("🧹 Limpando dados antigos...");
    await User.deleteMany({ tenantId: TRIAL_TENANT_ID });
    await Property.deleteMany({ tenantId: TRIAL_TENANT_ID });
    await Contract.deleteMany({ tenantId: TRIAL_TENANT_ID });

    const createdUsers = await User.create([{
      name: "Corretor Trial",
      email: "demo@imobisys.com",
      password: "senha_trial_123",
      role: "corretor",
      tenantId: TRIAL_TENANT_ID,
      status: "ativo"
    }]);

    await Property.create([{
      title: "Apartamento Decorado - Cariru",
      description: "Unidade mobiliada para demonstração.",
      price: 450000,
      type: "APARTMENT",
      status: "AVAILABLE", 
      tenantId: TRIAL_TENANT_ID,
      owner: createdUsers[0]._id,
      address: { street: "Rua Japão", number: "200", neighborhood: "Cariru", city: "Ipatinga", state: "MG", zipCode: "35160000" }
    }]);

    console.log("✅ Seed finalizado!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro:", error);
    process.exit(1);
  }
};
seedDatabase();
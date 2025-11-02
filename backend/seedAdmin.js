// backend/seedAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado ao MongoDB");

    const adminEmail = "admin@imobiliaria.com";
    const adminPassword = "Admin123"; // coloque a senha desejada

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin já existe. Atualizando senha...");
      existingAdmin.password = adminPassword;
      existingAdmin.role = "ADMIN";
      await existingAdmin.save();
      console.log("Senha do admin atualizada com sucesso!");
      process.exit(0);
    }

    const admin = new User({
      name: "Administrador",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
      status: "ATIVO",
    });

    await admin.save();
    console.log("Admin criado com sucesso!");
    process.exit(0);

  } catch (error) {
    console.error("Erro ao criar admin:", error);
    process.exit(1);
  }
};

seedAdmin();

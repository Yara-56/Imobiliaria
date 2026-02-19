import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

import Company from "../modules/companies/company.model.js";
import User from "../modules/users/modules/user.model.js";
import Property from "../modules/properties/models/property.model.js";
import { Tenant } from "../modules/tenants/models/tenant.model.js";
import Contract from "../modules/contracts/models/contract.model.js";
import { Payment } from "../modules/payments/models/payment.model.js";

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  try {
    console.log("🚀 Iniciando Seed Yara Enterprise (Versão Gráficos Ativos)...");
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("🧹 Limpando dados antigos...");
    await Promise.all([
      Company.deleteMany({}), 
      User.deleteMany({}), 
      Property.deleteMany({}),
      Tenant.deleteMany({}), 
      Contract.deleteMany({}), 
      Payment.deleteMany({})
    ]);

    // Reset de índices para evitar erros de duplicidade residual
    try {
      await mongoose.connection.collection('tenants').dropIndex("slug_1");
      await mongoose.connection.collection('tenants').dropIndex("cpf_1");
    } catch (e) { /* Índices limpos */ }

    // 🏢 1. EMPRESA ÚNICA (Garante que tudo pertença a este ID)
    const company = await Company.create({
      name: "Imobiliária Yara Lux",
      cnpj: `${random(10, 99)}.222.333/0001-44`
    });

    const password = await bcrypt.hash("123456", 10);
    const tempId = new mongoose.Types.ObjectId();

    // 👤 2. USUÁRIOS
    console.log("👤 Criando equipe...");
    const admin = new User({
      name: "Yara CEO", 
      email: "admin@yara.com", 
      password, 
      role: "admin",
      companyId: company._id, 
      tenantId: tempId
    });
    await admin.save({ validateBeforeSave: false });

    const corretor = new User({
      name: "Carlos Corretor", 
      email: "carlos@yara.com", 
      password, 
      role: "corretor",
      companyId: company._id, 
      tenantId: tempId
    });
    await corretor.save({ validateBeforeSave: false });

    // 🏠 3. IMÓVEIS (Status em Inglês para compatibilidade de filtros)
    console.log("🏠 Criando 20 imóveis...");
    const propertyDocs = [];
    for (let i = 1; i <= 20; i++) {
      const p = new Property({
        title: `Imóvel Premium ${i}`,
        description: `Imóvel exclusivo Yara número ${i} com acabamento de alto padrão.`,
        type: "APARTMENT",
        price: random(2500, 9500),
        address: { 
          street: `Rua Principal, ${100 + i}`, 
          city: "São Paulo", 
          state: "SP", 
          zipCode: "01310-100" 
        },
        status: i <= 15 ? "RENTED" : "AVAILABLE",
        companyId: company._id,
        owner: admin._id,
        tenantId: tempId
      });
      await p.save({ validateBeforeSave: false });
      propertyDocs.push(p);
    }

    // 👥 4. INQUILINOS (Garantindo Slugs e CPFs únicos)
    console.log("👥 Criando 30 inquilinos...");
    const tenantDocs = [];
    for (let i = 1; i <= 30; i++) {
      const uniqueId = new mongoose.Types.ObjectId();
      const t = new Tenant({
        _id: uniqueId,
        fullName: `Inquilino ${i}`,
        email: `cliente${i}-${uniqueId.toString().slice(-4)}@email.com`,
        cpf: `${random(100, 999)}${random(100, 999)}${random(100, 999)}${random(10, 99)}`,
        phone: "11999999999",
        tenantId: uniqueId.toString(),
        owner: corretor._id,
        companyId: company._id,
        status: "ACTIVE",
        rentValue: random(2500, 5000).toString(),
        slug: `inquilino-${i}-${uniqueId.toString().slice(-6)}`
      });
      await t.save({ validateBeforeSave: false });
      tenantDocs.push(t);
    }

    // 💰 5. CONTRATOS E FINANCEIRO (O "Coração" do Dashboard)
    console.log("💰 Gerando histórico financeiro de 6 meses...");
    // Meses retroativos para gerar a linha do gráfico
    const months = ["09/2025", "10/2025", "11/2025", "12/2025", "01/2026", "02/2026"];
    
    for (let i = 0; i < 15; i++) {
      const contract = new Contract({
        tenantId: tenantDocs[i]._id,
        propertyId: propertyDocs[i]._id,
        rentValue: propertyDocs[i].price,
        startDate: new Date("2025-08-01"),
        status: "ACTIVE",
        companyId: company._id
      });
      await contract.save({ validateBeforeSave: false });

      for (const m of months) {
        const isLastMonth = m === "02/2026";
        const payment = new Payment({
          contractId: contract._id,
          tenantId: tenantDocs[i]._id,
          amount: propertyDocs[i].price,
          // Inserindo PAID (Inglês) para garantir que o Dashboard some os valores
          status: isLastMonth ? "PENDING" : "PAID", 
          referenceMonth: m,
          paymentDate: isLastMonth ? null : new Date(),
          companyId: company._id
        });
        await payment.save({ validateBeforeSave: false });
      }
    }

    console.log("\n" + "=".repeat(40));
    console.log("✅ SEED EXECUTADO COM SUCESSO!");
    console.log("🚀 Dados prontos para o Dashboard.");
    console.log("👤 Login: admin@yara.com | Senha: 123456");
    console.log("=".repeat(40));
    
    await mongoose.connection.close();
    process.exit(0);

  } catch (error: any) {
    console.error("\n🚨 ERRO NO SEED:", error.message);
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
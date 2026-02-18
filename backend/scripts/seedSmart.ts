import { fakerPT_BR as faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// ✅ Caminhos ajustados para a sua estrutura modular real
import User from '../src/modules/users/modules/user.model.js'; 
import { Tenant } from '../src/modules/tenants/models/tenant.model.js';
import { Payment } from '../src/modules/payments/models/payment.model.js';

dotenv.config();

const seedSmart = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/imobiliaria');
    console.log("🛠️ Gerando Ecossistema Imobiliário Dinâmico via Faker...");

    const admin = await User.findOne({ email: 'admin@meusistema.com' });
    if (!admin) return console.log("❌ Admin não encontrado. Rode o seedAdmin primeiro.");

    // Limpeza profunda para o novo ambiente de escala
    await Tenant.deleteMany({ owner: admin._id });
    await Payment.deleteMany({ owner: admin._id });

    for (let i = 0; i < 50; i++) {
      // ✅ RESOLUÇÃO DO ERRO TS(2339): Usando replaceSymbols para CPF
      const cpfSimulado = faker.helpers.replaceSymbols('###.###.###-##');
      const plano = faker.helpers.arrayElement(['BASIC', 'PRO', 'ENTERPRISE']);
      const valorAluguel = faker.finance.amount({ min: 1200, max: 8000, dec: 0 });

      // 1. Criar Inquilino com dados realistas do Faker
      const tenant = await Tenant.create({
        fullName: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        document: cpfSimulado,
        status: faker.helpers.arrayElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'SUSPENDED']),
        plan: plano,
        preferredPaymentMethod: faker.helpers.arrayElement(['PIX', 'BOLETO', 'CARTAO_RECORRENTE']),
        rentValue: valorAluguel,
        billingDay: faker.number.int({ min: 1, max: 28 }),
        owner: admin._id, // ✅ Multi-tenancy
        settings: {
          maxUsers: plano === 'ENTERPRISE' ? 10 : 2,
          maxProperties: plano === 'ENTERPRISE' ? 100 : 10,
          features: { crm: true, automation: plano !== 'BASIC' }
        },
        createdAt: faker.date.past({ years: 1 }) // Clientes com até 1 ano de casa
      });

      // 2. Gerar Histórico Financeiro Dinâmico
      // Calcula quantos meses o cliente está na imobiliária
      const mesesAtivos = Math.floor((Date.now() - new Date(tenant.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30));

      for (let m = 0; m <= mesesAtivos; m++) {
        const dataVencimento = new Date(tenant.createdAt);
        dataVencimento.setMonth(dataVencimento.getMonth() + m);
        
        const mesRef = (dataVencimento.getMonth() + 1).toString().padStart(2, '0');
        const anoRef = dataVencimento.getFullYear();

        // Simula comportamento: 90% de chance de estar pago
        const estaPago = faker.number.float() < 0.90;

        await Payment.create({
          amount: Number(tenant.rentValue),
          referenceMonth: `${mesRef}/${anoRef}`,
          paymentDate: estaPago ? dataVencimento : null,
          status: estaPago ? 'Pago' : 'Pendente',
          method: tenant.preferredPaymentMethod,
          tenantId: tenant._id,
          owner: admin._id,
          contractId: new mongoose.Types.ObjectId()
        });
      }
    }

    console.log("✅ 50 Inquilinos e histórico dinâmico gerados com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no Seeding Inteligente:", error);
    process.exit(1);
  }
};

seedSmart();
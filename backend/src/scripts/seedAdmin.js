import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Referenciando seu model profissional

dotenv.config();

const seedAdmin = async () => {
  try {
    // 1. Conexão robusta
    if (!process.env.MONGO_URI) {
      throw new Error('A variável MONGO_URI não foi definida no arquivo .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('\x1b[34m%s\x1b[0m', '📡 Conectando ao MongoDB para provisionamento...');

    // 2. Verificação de existência (Idempotência)
    // Usamos o e-mail como chave única, conforme definido no seu UserSchema
    const adminEmail = 'admin@imobisys.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('\x1b[33m%s\x1b[0m', `⚠️  O administrador (${adminEmail}) já está cadastrado.`);
      
      // Opcional: Atualizar a senha se necessário ou apenas sair
      process.exit(0);
    }

    // 3. Criação utilizando o construtor do Model
    // Importante: Seu model já tem o middleware userSchema.pre('save'), 
    // então passamos a senha em texto puro e ele cuidará do Hash!
    const admin = new User({
      name: 'Yara Administradora',
      email: adminEmail,
      password: 'SenhaSegura123!', 
      role: 'admin',
      status: 'ATIVO' // Garante que o usuário já comece podendo logar
    });

    await admin.save();

    console.log('\x1b[32m%s\x1b[0m', '✅ Administradora criada com sucesso!');
    console.log('-----------------------------------------------');
    console.log(`E-mail: ${adminEmail}`);
    console.log('Acesso: Liberado (ADMIN)');
    console.log('-----------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Falha crítica no provisionamento:');
    console.error(err.message);
    process.exit(1);
  }
};

// Execução do script
seedAdmin();
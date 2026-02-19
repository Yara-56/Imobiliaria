// backend/scripts/criarAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('❌ Erro: MONGO_URI não está definido no arquivo .env');
  process.exit(1);
}

async function criarAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Conectado ao MongoDB');

    const adminExistente = await Usuario.findOne({ email: 'admin@meusistema.com' });
    if (adminExistente) {
      console.log('⚠️ Admin já existe. Cancelando.');
      process.exit(0);
    }

    const senhaCriptografada = await bcrypt.hash('senhaSuperSecreta123!', 10);

    const novoAdmin = new Usuario({
      nome: 'Administrador Master',
      email: 'admin@meusistema.com',
      senha: senhaCriptografada,
      role: 'admin'
    });

    await novoAdmin.save();
    console.log('✅ Usuário administrador criado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao conectar ou criar admin:', err);
    process.exit(1);
  }
}

criarAdmin();

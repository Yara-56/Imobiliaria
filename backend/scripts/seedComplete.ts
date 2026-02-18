import mongoose from 'mongoose';
import dotenv from 'dotenv';

/** * 🔍 RESOLUÇÃO EXATA:
 * Como o seed está em 'backend/scripts/', precisamos subir um nível (../)
 * para entrar em 'src/' e seguir o caminho modular da sua imagem.
 */
import User from '../src/modules/users/modules/user.model.js'; 
import { Tenant } from '../src/modules/tenants/models/tenant.model.js';
import { Payment } from '../src/modules/payments/models/payment.model.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imobiliaria';

const seedComplete = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🚀 Cluster Aura conectado. Iniciando população...");

    // Busca o admin para vincular os dados (Multi-tenancy)
    let admin = await User.findOne({ email: 'admin@meusistema.com' });
    
    if (!admin) {
      admin = await User.create({
        name: 'Admin Aura',
        email: 'admin@meusistema.com',
        password: 'senhaSuperSecreta123!',
        role: 'admin'
      });
    }

    // Limpa dados antigos do admin para teste limpo
    await Tenant.deleteMany({ owner: admin._id });
    await Payment.deleteMany({ owner: admin._id });

    // Lógica para os 30 inquilinos... (conforme o código anterior)
    
    console.log("✅ Sistema populado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro de importação ou conexão:', error);
    process.exit(1);
  }
};

seedComplete();
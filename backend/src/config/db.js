import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Conexão limpa, sem opções antigas
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Mostra em qual host conectou (útil para saber se é local ou nuvem)
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${err.message}`);
    // Encerra o app se o banco não subir (Fail Fast)
    process.exit(1);
  }
};

export default connectDB;
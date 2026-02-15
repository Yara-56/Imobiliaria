import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Mongo conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erro Mongo:', error.message);
    process.exit(1);
  }
};

export default connectDB;

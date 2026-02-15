import mongoose from 'mongoose';
import { env } from './env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== 'production', // evita custo em prod
    });

    logger.info(`✅ MongoDB conectado: ${conn.connection.host}`);

  } catch (error) {
    logger.error('❌ Erro ao conectar no MongoDB', error);
    process.exit(1); // Fail Fast real
  }
};

export default connectDB;

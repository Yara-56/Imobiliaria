import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
  });
};

start();

// backend/routes/user.routes.js
import express from 'express';
import bcrypt from 'bcrypt';
import { userController } from '../controllers/index.js';
import { proteger } from '../middlewares/auth.middleware.js';
import User from '../models/User.js'; // modelo do usuário

const router = express.Router();

// Rota de registro e login
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rota protegida de perfil
router.get('/perfil', proteger, (req, res) => {
  res.json({ mensagem: 'Perfil do usuário autenticado', usuario: req.usuario });
});

// 🚨 ROTA TEMPORÁRIA PARA CRIAR O PRIMEIRO USUÁRIO ADMIN
router.post('/criar-admin', async (req, res) => {
  try {
    const existe = await User.findOne({ email: 'admin@meusistema.com' });
    if (existe) return res.status(400).json({ erro: 'Usuário já existe' });

    const senhaCriptografada = await bcrypt.hash('senhaSuperSecreta123!', 10);

    const novoAdmin = new User({
      nome: 'Admin',
      email: 'admin@meusistema.com',
      senha: senhaCriptografada,
      role: 'admin'
    });

    await novoAdmin.save();
    res.status(201).json({ mensagem: 'Usuário admin criado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar admin' });
  }
});

export default router;

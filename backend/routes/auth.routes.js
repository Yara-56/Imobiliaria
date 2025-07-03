import express from 'express';
import { authController } from '../controllers/index.js';

const router = express.Router();

// 🔐 Login do usuário
router.post('/login', authController.loginUser);

// 👤 Registro de novo usuário
router.post('/register', authController.registerUser);

// ⚡ Acesso rápido para demonstração (sempre habilitado para testes)
router.post('/acesso-rapido', authController.acessoRapido);

export default router;

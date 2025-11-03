// backend/routes/user.routes.js

import express from 'express';
import { 
  loginUser, 
  activateAccount, 
  getUserProfile,
  getUserByEmail // Importando a função de buscar usuário por email
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- ROTAS PÚBLICAS ---
router.post('/login', loginUser);
router.post('/activate-account', activateAccount);
router.get('/by-email', getUserByEmail); // Rota pública para buscar usuário por email

// --- ROTAS PROTEGIDAS ---
router.get('/profile', verifyToken, getUserProfile);

export default router;

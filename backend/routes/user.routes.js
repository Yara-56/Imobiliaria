import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js'; // Verifique o caminho de importação

const router = express.Router();

// Rota para registrar novo usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login);

// Exemplo de rota protegida que requer autenticação
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Perfil do usuário', user: req.user });
});

export default router;

import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Rota protegida teste
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

export default router;

import express from 'express';
import { login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', login);

export default router;
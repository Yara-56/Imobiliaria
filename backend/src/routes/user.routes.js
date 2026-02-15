// backend/routes/user.routes.js

import express from "express";

// Importando os controllers relevantes do user.controller.js
import {
  loginUser,
  activateAccount,
  getUserProfile,
  // Futuramente você adicionará: forgotPassword, resetPassword
} from "../controllers/user.controller.js";

// Importando apenas o middleware de verificação de token,
// pois as permissões de admin não se aplicam aqui.
import { verifyToken } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// --- ROTAS PÚBLICAS ---

// Rota para o login de qualquer usuário (admin ou corretor)
router.post("/login", loginUser);

// Rota para ativar uma nova conta a partir de um link de convite
// É pública porque a segurança está na validação do token
router.post("/activate-account", activateAccount);

// --- ROTAS PROTEGIDAS (Apenas para usuários logados) ---

// Rota para buscar os dados do perfil do próprio usuário logado
// 1º: verifyToken - Garante que o usuário está logado.
// 2º: getUserProfile - Controller que busca e retorna os dados.
router.get("/profile", verifyToken, getUserProfile);

export default router;

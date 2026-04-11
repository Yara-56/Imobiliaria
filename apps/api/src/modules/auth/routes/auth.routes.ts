import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "@shared/middlewares/auth.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Autenticado
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login);

/**
 * @openapi
 * /api/v1/auth/trial:
 *   post:
 *     tags: [Auth]
 *     summary: Entrar em modo trial
 *     responses:
 *       200:
 *         description: Sessão trial
 */
router.post("/trial", authController.enterTrial);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Usuário atual (JWT)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *       401:
 *         description: Não autenticado
 */
router.get("/me", protect, authController.getMe);

export default router;
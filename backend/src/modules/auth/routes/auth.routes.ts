import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

// Rotas públicas
router.post("/login", authController.login);
router.post("/trial", authController.enterTrial);

// Rotas protegidas
router.get("/me", protect, authController.getMe);

/**
 * ✅ ESSENCIAL: Resolvendo o erro ts(1192)
 * Sem esta linha, o 'import authRoutes' no arquivo principal falha.
 */
export default router;
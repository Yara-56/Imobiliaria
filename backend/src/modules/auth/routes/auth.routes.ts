import { Router } from "express";
/** * ✅ No NodeNext, imports de arquivos locais DEVEM terminar em .js.
 * Isso resolve o erro de módulo não encontrado no seu terminal.
 */
import * as authController from "../controllers/auth.controller.js";
import { protect } from "@shared/middlewares/auth.middleware.js";

const router = Router();

// Rotas Públicas
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Rotas Protegidas
router.use(protect);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);

export default router;
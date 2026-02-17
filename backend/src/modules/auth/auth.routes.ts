import { Router } from "express";
import * as authController from "./auth.controller.ts";
import { protect } from "../../shared/middlewares/auth.middleware.ts";

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
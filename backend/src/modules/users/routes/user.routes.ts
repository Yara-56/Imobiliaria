import { Router } from "express";
import * as authController from "../auth/auth.controller.ts";
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

// Públicas
router.post("/login", authController.login);
router.post("/register", authController.register);

// Protegidas
router.use(protect);
router.get("/me", authController.getMe);
router.post("/logout", authController.logout);

export default router;

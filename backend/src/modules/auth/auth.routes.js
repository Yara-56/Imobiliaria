import { Router } from "express";
import { login, logout } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { loginSchema } from "./auth.schema.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Limitador específico para login (evita brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Muitas tentativas de login, tente novamente após 15 minutos",
});

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);

export default router;

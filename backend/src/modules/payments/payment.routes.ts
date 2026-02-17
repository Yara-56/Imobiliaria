import { Router } from "express";
import { listPayments, createPayment } from "./payment.controller";
// ✅ Caminho corrigido para a pasta auth (um nível acima)
import { verifyToken } from "../auth/auth.middleware";

const router = Router();

// 🛡️ Proteção Global: Todas as rotas abaixo exigem login
router.use(verifyToken);

router.get("/", listPayments);
router.post("/", createPayment);

export default router;
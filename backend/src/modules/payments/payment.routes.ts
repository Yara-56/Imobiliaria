import { Router } from "express";
import { listPayments, createPayment } from "./payment.controller";
// O caminho sobe dois níveis para sair de modules/payments e chegar em middlewares
import { verifyToken } from "../../middlewares/auth.middleware";

const router = Router();

// 🛡️ Middleware de Cybersecurity: Protege todas as rotas de pagamento
router.use(verifyToken);

/**
 * @route   GET /api/payments
 * @desc    Lista pagamentos vinculados ao usuário logado
 */
router.get("/", listPayments);

/**
 * @route   POST /api/payments
 * @desc    Registra um novo pagamento para a imobiliária
 */
router.post("/", createPayment);

export default router;
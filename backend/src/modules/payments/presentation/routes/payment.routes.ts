import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { protect } from "../../../../shared/middlewares/auth.middleware.js";

const router = Router();

// 🔐 Middleware de autenticação obrigatória
router.use(protect);

const BASE = "/v1/payments";

/**
 * LISTAR & CRIAR PAGAMENTO
 */
router
  .route(BASE)
  .get(paymentController.listPayments.bind(paymentController))
  .post(paymentController.createPayment.bind(paymentController));

/**
 * OPERAR SOBRE UM PAGAMENTO ESPECÍFICO
 */
router
  .route(`${BASE}/:id`)
  .get(paymentController.getPaymentById.bind(paymentController))
  .patch(paymentController.updatePaymentStatus.bind(paymentController))
  .delete(paymentController.deletePayment.bind(paymentController));

export default router;
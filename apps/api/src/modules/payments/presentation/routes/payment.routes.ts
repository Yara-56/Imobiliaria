import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { protect } from "@shared/middlewares/auth.middleware.js";

const router = Router();

// 🔐 Middleware de autenticação obrigatória
router.use(protect);

/**
 * @openapi
 * /api/v1/payments:
 *   get:
 *     tags: [Pagamentos]
 *     summary: Listar pagamentos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista
 *   post:
 *     tags: [Pagamentos]
 *     summary: Criar pagamento
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Criado
 */
router
  .route("/")
  .get(paymentController.listPayments.bind(paymentController))
  .post(paymentController.createPayment.bind(paymentController));

/**
 * @openapi
 * /api/v1/payments/{id}:
 *   get:
 *     tags: [Pagamentos]
 *     summary: Buscar pagamento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pagamento
 *   patch:
 *     tags: [Pagamentos]
 *     summary: Atualizar status do pagamento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Atualizado
 *   delete:
 *     tags: [Pagamentos]
 *     summary: Excluir pagamento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Removido
 */
router
  .route("/:id")
  .get(paymentController.getPaymentById.bind(paymentController))
  .patch(paymentController.updatePaymentStatus.bind(paymentController))
  .delete(paymentController.deletePayment.bind(paymentController));

export default router;
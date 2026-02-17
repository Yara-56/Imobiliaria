import { Router } from "express";
// ✅ Importação com .js para Node v20 (ESM)
import * as paymentController from "./payment.controller.js"; 
import { protect } from "../../shared/middlewares/auth.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js";
// ✅ Schema para garantir que o Valor e o Mês de Referência venham corretos
import { createPaymentSchema } from "./payment.schema.ts";

const router = Router();

/**
 * 🛡️ Camada de Segurança (Cybersecurity)
 * O middleware 'protect' injeta o 'req.user' para que a Yara só veja os
 * pagamentos da sua própria imobiliária (Isolamento por Tenant).
 */
router.use(protect);

router
  .route("/")
  /** * @route GET /api/v1/payments 
   * @desc Lista pagamentos filtrados pelo dono logado 
   */
  .get(paymentController.listPayments)
  
  /** * @route POST /api/v1/payments 
   * @desc Registra um novo pagamento com validação de esquema
   */
  .post(
    validate(createPaymentSchema), 
    paymentController.createPayment
  );

router
  .route("/:id")
  /** * @route GET /api/v1/payments/:id 
   * @desc Detalhes de um pagamento (Útil para abrir o comprovante PDF)
   */
  .get(paymentController.getPaymentById)
  
  /** * @route PATCH /api/v1/payments/:id 
   * @desc Atualizar status (Ex: de Pendente para Pago)
   */
  .patch(paymentController.updatePaymentStatus);

export default router;
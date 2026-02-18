import { Router } from "express";
/**
 * ✅ RESOLUÇÃO DE MÓDULO:
 * O sufixo .js é obrigatório para o Node v20 (ESM). 
 * O TS buscará o arquivo .ts correspondente no seu MacBook.
 */
import * as paymentController from "../controllers/payment.controller.js";
import { protect } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { createPaymentSchema } from "../schemas/payment.schema.js";

const router = Router();

// 🛡️ Segurança: Exige autenticação para proteger os dados da imobiliária
router.use(protect);

router
  .route("/")
  .get(paymentController.listPayments) 
  .post(validate(createPaymentSchema), paymentController.createPayment);

router
  .route("/:id")
  .get(paymentController.getPaymentById)
  .patch(paymentController.updatePaymentStatus);

export default router;
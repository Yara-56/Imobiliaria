import { Router } from "express";
/**
 * ✅ CORREÇÃO DO CAMINHO:
 * O arquivo está em ../controllers/payment.controller.js.
 * Usamos .js porque o NodeNext (ESM) exige a extensão do arquivo compilado.
 */
import * as paymentController from "../controllers/payment.controller.js";
import { protect } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { createPaymentSchema } from "../schemas/payment.schema.js";

const router = Router();

// 🛡️ Middleware de proteção global para as rotas de pagamento
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
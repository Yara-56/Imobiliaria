import { Router } from "express";
// ✅ Importação com .js para Node v20 (ESM)
import * as paymentController from "./payment.controller.js"; 
import { protect } from "../../shared/middlewares/auth.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js";
// ✅ CORREÇÃO: Mudado de .ts para .js para compatibilidade ESM
import { createPaymentSchema } from "./payment.schema.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(paymentController.listPayments) // ✅ Agora o TS vai encontrar
  .post(
    validate(createPaymentSchema), 
    paymentController.createPayment
  );

router
  .route("/:id")
  .get(paymentController.getPaymentById)
  .patch(paymentController.updatePaymentStatus);

export default router;
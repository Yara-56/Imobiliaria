import { Router } from "express";
import { 
  listPayments, 
  createPayment, 
  getPaymentById, 
  updatePaymentStatus // ✅ Importação nomeada direta para maior clareza
} from "../controllers/payment.controller.js";
import { protect } from "../../../shared/middlewares/auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import { createPaymentSchema } from "../schemas/payment.schema.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(listPayments) 
  .post(validate(createPaymentSchema), createPayment);

router
  .route("/:id")
  .get(getPaymentById)
  .patch(updatePaymentStatus); // ✅ Agora o TS reconhecerá o membro diretamente

export default router;
import { Router } from "express";
import {
  listPayments,
  createPayment,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from "../presentation/controllers/payment.controller";
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

// 🔐 Todas as rotas exigem autenticação
router.use(protect);

router
  .route("/")
  .get(listPayments)       // GET /payments
  .post(createPayment);    // POST /payments

router
  .route("/:id")
  .get(getPaymentById)           // GET /payments/:id
  .patch(updatePaymentStatus)    // PATCH /payments/:id
  .delete(deletePayment);        // DELETE /payments/:id

export default router;
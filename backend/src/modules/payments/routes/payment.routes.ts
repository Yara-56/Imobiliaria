import { Router } from "express";
import {
  listPayments,
  createPayment,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from "../presentation/controllers/payment.controller.js"; // ✅ novo caminho
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(listPayments)
  .post(createPayment);

router
  .route("/:id")
  .get(getPaymentById)
  .patch(updatePaymentStatus)
  .delete(deletePayment); // ✅ adicionado

export default router;
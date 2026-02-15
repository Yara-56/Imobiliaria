// routes/payment.routes.js

import express from "express";
import {
  listPayments,
  createPayment,
} from "./payment.controller.js";
// CORREÇÃO: Importando o middleware com o nome correto
import { verifyToken } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// Aplica o middleware "verifyToken" a TODAS as rotas definidas abaixo neste arquivo.
// CORREÇÃO: Usando a função com o nome correto
router.use(verifyToken);

/**
 * @route   GET /api/pagamentos
 * @desc    Lista todos os pagamentos realizados
 * @access  Privado (token necessário)
 */
router.get("/", listPayments);

/**
 * @route   POST /api/pagamentos
 * @desc    Registra um novo pagamento (etapa: Receber Pagamento)
 * @access  Privado (token necessário)
 */
router.post("/", createPayment);

export default router;

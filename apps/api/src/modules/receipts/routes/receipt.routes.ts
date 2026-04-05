import { Router } from "express";
/** * ✅ No padrão NodeNext, mesmo que o arquivo seja .ts, o import deve usar .js.
 */
import {
  listReceipts,
  createReceipt,
  getReceiptById,
} from "../controllers/receipt.controller.js";

// ✅ Importamos o middleware de segurança usando o Path Alias configurado
import { protect } from "../../../shared/middlewares/auth.middleware.js";

const router = Router();

/**
 * 🔒 Camada de Proteção Global do Módulo
 * A partir daqui, todas as rotas exigem um token JWT válido.
 * O middleware 'protect' injeta o usuário e o tenantId no objeto 'req'.
 */
router.use(protect);

/**
 * 🧾 Rotas de Recibos
 */
router.get("/", listReceipts);       // Listagem protegida e filtrada por admin
router.post("/", createReceipt);     // Criação vinculada ao pagamento e tenant
router.get("/:id", getReceiptById); // Busca detalhada com validação de posse

export default router;
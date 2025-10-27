// backend/routes/tenant.routes.js
// --- ROTAS AJUSTADAS PARA AMBIENTE DEV (SEM AUTH) ---

import express from "express";
import {
  listTenants,
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
} from "../controllers/tenant.controller.js";
// NOVO: Importa o middleware de upload
import upload from '../middlewares/upload.middleware.js'; 


const router = express.Router();

// =========================================================
// 🚀 MODO DEV — sem autenticação
// =========================================================

// Listar inquilinos
router.get("/", listTenants);

// Criar inquilino
router.post("/", createTenant);

// Rotas que usam o ID (Detalhes, Atualização e Exclusão)
router.get("/:id", getTenant); // GET /api/tenants/:id (Detalhes)

// CORREÇÃO CRÍTICA: Adiciona o upload.array() para processar os arquivos
router.put("/:id", upload.array('documents[]', 5), updateTenant); // PUT /api/tenants/:id (Salvar Edições)

router.delete("/:id", deleteTenant); // DELETE /api/tenants/:id (Excluir Inquilino)

// ... (Modo PROD/Comentado permanece o mesmo)

export default router;

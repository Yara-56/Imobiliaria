// backend/routes/property.routes.js
import express from "express";
import multer from "multer";
import * as controller from "../controllers/property.controller.js";

// Cria um roteador Express
const router = express.Router();

// Configuração básica do Multer (salva arquivos em /uploads)
const upload = multer({ dest: "uploads/" });

/**
 * Middleware que aplica o Multer **apenas se** o Content-Type for multipart/form-data.
 */
function maybeMulter(req, res, next) {
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (ct.startsWith("multipart/form-data")) {
    return upload.array("documents[]")(req, res, next);
  }
  return next();
}

// =========================================================
// 🚀 MODO DEV — sem autenticação
// =========================================================

// --- ⬇️ ROTAS 'GET' ESPECÍFICAS VÊM PRIMEIRO ⬇️ ---

// Listar imóveis + filtros/paginação
router.get("/", controller.listProperties);

// Rota para buscar os "tipos" de imóvel (para preencher o dropdown)
router.get("/tipos", controller.getPropertyTypes); 

// Rota para buscar os "agentes/corretores" (para preencher o dropdown)
router.get("/agentes", controller.getPropertyAgents);

// --- ⬇️ ROTA 'GET' DINÂMICA VEM POR ÚLTIMO ⬇️ ---
// Ela deve vir depois de '/', '/tipos', '/agentes', etc.
router.get("/:id", controller.getPropertyById);


// --- ROTAS 'POST', 'PATCH', 'DELETE' ---

// Criar imóvel (aceita JSON ou multipart com documentos)
router.post("/", maybeMulter, controller.createProperty);

// Atualizar imóvel parcialmente (aceita JSON ou multipart)
router.patch("/:id", maybeMulter, controller.updateProperty);

// Adicionar documentos a um imóvel existente
router.post("/:id/documents", maybeMulter, controller.addPropertyDocuments);

// Remover documento específico de um imóvel
router.delete("/:id/documents/:docId", controller.removePropertyDocument);

// Remover (deletar) imóvel completo
router.delete("/:id", controller.removeProperty);

// =========================================================
// 🔒 MODO PROD — (Comentado por enquanto)
// =========================================================
/*
import auth from "../middlewares/auth.middleware.js";
// ... (suas rotas com 'auth' aqui)
*/

// Exporta o router para uso no server.js
export default router;
import { Router } from "express";
import * as propertyController from "./property.controller";
/** * CORREÇÃO DE ROTA: 
 * O arquivo está em: backend/src/shared/middlewares/auth.middleware.ts
 * Como este arquivo de rotas está em: backend/src/modules/properties/
 * Precisamos subir dois níveis (../../) para chegar em src/ e entrar em shared.
 */
import { protect } from "../../shared/middlewares/auth.middleware";

const router = Router();

// Todas as rotas de imóveis exigem login (imobisys_token)
// O middleware 'protect' garante a segurança que seu estágio exige.
router.use(protect);

router
  .route("/")
  .get(propertyController.getAllProperties) // Lista todos os imóveis do dono logado
  .post(propertyController.createProperty); // Cria um novo imóvel com o Schema completo

router
  .route("/:id")
  .get(propertyController.getPropertyById)  // Busca um imóvel específico
  .patch(propertyController.updateProperty)  // Atualiza (útil para mudar status: Alugado/Vendido)
  .delete(propertyController.deleteProperty); // Remove o imóvel

export default router;
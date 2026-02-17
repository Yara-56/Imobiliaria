import { Router } from "express";
import * as propertyController from "./property.controller.ts";
import { protect, authorize } from "../../shared/middlewares/auth.middleware.ts";
import { validate } from "../../shared/middlewares/validate.middleware.ts";
import { 
  createPropertySchema, 
  updatePropertySchema, 
  getPropertySchema 
} from "./property.schema.ts";

const router = Router();

/**
 * 🔒 Camada de Proteção Global
 * Garante que ninguém acesse os imóveis sem um token JWT válido.
 * O middleware 'protect' também injeta o tenantId no req para o controller usar.
 */
router.use(protect);

/**
 * 🏠 Rotas de Coleção
 */
router
  .route("/")
  .get(
    // Clientes, corretores e admins podem visualizar a lista (filtrada por tenantId no controller)
    propertyController.getAllProperties
  )
  .post(
    // Restrito a quem opera a imobiliária
    authorize("admin", "corretor"),
    validate(createPropertySchema),
    propertyController.createProperty
  );

/**
 * 🔍 Rotas por ID
 */
router
  .route("/:id")
  .get(
    validate(getPropertySchema),
    propertyController.getPropertyById
  )
  .patch(
    authorize("admin", "corretor"),
    validate(updatePropertySchema),
    propertyController.updateProperty
  )
  .delete(
    // Segurança máxima: Apenas o dono/admin da imobiliária remove registros
    authorize("admin"),
    validate(getPropertySchema),
    propertyController.deleteProperty
  );

export default router;
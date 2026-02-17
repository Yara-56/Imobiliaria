import { Router } from "express";
// ✅ Importação com .js para compatibilidade com ESM no Node 20
import * as propertyController from "./property.controller.js"; 
import { protect } from "../../shared/middlewares/auth.middleware.js"; 
import { validate } from "../../shared/middlewares/validate.middleware.js"; 
import { 
  createPropertySchema, 
  updatePropertySchema, 
  getPropertySchema 
} from "./property.schema.js";

const router = Router();

/**
 * 🛡️ Camada de Proteção
 * O middleware 'protect' garante que o tenantId e o userId estejam disponíveis
 * para isolar os imóveis da imobiliária da sua avó.
 */
router.use(protect);

router
  .route("/")
  .get(propertyController.getAllProperties) 
  .post(
    validate(createPropertySchema), 
    propertyController.createProperty 
  );

router
  .route("/:id")
  .get(
    validate(getPropertySchema), 
    propertyController.getPropertyById 
  )
  .patch( 
    validate(updatePropertySchema), 
    propertyController.updateProperty 
  )
  .delete(
    validate(getPropertySchema), 
    propertyController.deleteProperty 
  );

export default router;
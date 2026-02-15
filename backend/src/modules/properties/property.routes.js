import { Router } from "express";
import * as propertyController from "./property.controller.js";
import { protect } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validate.middleware.js";
import { 
  createPropertySchema, 
  updatePropertySchema, 
  getPropertySchema 
} from "./property.schema.js";

const router = Router();

// 1. Camada de Segurança: Global para este módulo
router.use(protect);

// 2. Definição das Rotas
router
  .route("/")
  .get(propertyController.list) // Listagem (com paginação no service)
  .post(
    validate(createPropertySchema), 
    propertyController.create
  );

router
  .route("/:id")
  .get(
    validate(getPropertySchema), 
    propertyController.getById
  )
  .patch( // Usamos PATCH para atualizações parciais (mais profissional que PUT)
    validate(updatePropertySchema), 
    propertyController.update
  )
  .delete(
    validate(getPropertySchema), 
    propertyController.remove
  );

export default router;
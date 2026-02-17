import { Router } from "express";
// Importamos tudo para usar o prefixo propertyController
import * as propertyController from "./property.controller"; 
import { verifyToken } from "../auth/auth.middleware"; 
import { validate } from "../../shared/middlewares/validate.middleware"; 
import { 
  createPropertySchema, 
  updatePropertySchema, 
  getPropertySchema 
} from "./property.schema";

const router = Router();

// 🛡️ Segurança: Protege todas as rotas de propriedades
router.use(verifyToken);

router
  .route("/")
  .get(propertyController.getAllProperties) // ✅ MUDOU AQUI: O nome deve ser igual ao exportado
  .post(
    validate(createPropertySchema), 
    propertyController.createProperty // ✅ MUDOU AQUI
  );

router
  .route("/:id")
  .get(
    validate(getPropertySchema), 
    propertyController.getPropertyById // ✅ MUDOU AQUI
  )
  .patch( 
    validate(updatePropertySchema), 
    propertyController.updateProperty // ✅ MUDOU AQUI
  )
  .delete(
    validate(getPropertySchema), 
    propertyController.deleteProperty // ✅ MUDOU AQUI
  );

export default router;
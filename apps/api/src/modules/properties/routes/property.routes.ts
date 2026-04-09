import { Router } from "express";
import { container } from "tsyringe";

import { PropertiesController } from "../controllers/PropertiesController.js";

const router = Router();

// resolve depois que o container já foi carregado
const controller = container.resolve(PropertiesController);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
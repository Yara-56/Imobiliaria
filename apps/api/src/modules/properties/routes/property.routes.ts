import { Router } from "express";
import { container } from "tsyringe";

import { PropertiesController } from "../controllers/PropertiesController.js";

const router = Router();

// resolve depois que o container já foi carregado
const controller = container.resolve(PropertiesController);

/**
 * @openapi
 * /api/v1/properties:
 *   get:
 *     tags: [Imóveis]
 *     summary: Listar imóveis
 *     responses:
 *       200:
 *         description: Lista de imóveis
 *   post:
 *     tags: [Imóveis]
 *     summary: Criar imóvel
 *     responses:
 *       201:
 *         description: Criado
 */
router.post("/", controller.create);
router.get("/", controller.getAll);

/**
 * @openapi
 * /api/v1/properties/{id}:
 *   get:
 *     tags: [Imóveis]
 *     summary: Buscar imóvel por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Imóvel encontrado
 *       404:
 *         description: Não encontrado
 *   put:
 *     tags: [Imóveis]
 *     summary: Atualizar imóvel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Atualizado
 *   delete:
 *     tags: [Imóveis]
 *     summary: Remover imóvel
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Removido
 */
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
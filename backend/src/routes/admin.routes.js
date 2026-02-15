import express from "express";
// ---> Importe o controller que acabamos de criar
import { inviteUser } from "../controllers/admin.controller.js";
// Importe os middlewares de segurança
import { verifyToken, checkRole } from "../src/middlewares/auth.middleware.js";

const router = express.Router();

// Rota para convidar um novo usuário (corretor ou admin)
// A requisição passará por 3 etapas:
// 1. verifyToken: Garante que há um usuário logado.
// 2. checkRole(['admin']): Garante que o usuário logado é um administrador.
// 3. inviteUser: Se tudo estiver OK, executa a lógica do nosso novo controller.
router.post("/invite", verifyToken, checkRole(["admin"]), inviteUser);

export default router;

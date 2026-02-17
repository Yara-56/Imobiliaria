import { Router } from "express";
import authRoutes from "../../modules/auth/auth.routes.ts";
import userRoutes from "../../modules/users/user.routes.ts";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);

// ✅ Certifique-se de que o nome aqui é exatamente apiRouter
export { apiRouter };
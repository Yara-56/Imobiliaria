import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { protect } from "@shared/middlewares/auth.middleware.js";

const router = Router();

router.post("/login", userController.login);
router.post("/register", userController.register);

router.use(protect);
router.get("/me", userController.getMe);
router.post("/logout", userController.logout);

export default router;

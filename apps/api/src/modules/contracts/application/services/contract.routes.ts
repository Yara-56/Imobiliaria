import { Router } from "express";
import { ContractController } from "./ContractController.js";

const contractRoutes = Router();
const contractController = new ContractController();

// Rota: POST /api/contracts/send
// Chama a integração ZapSign + Resend
contractRoutes.post("/send", contractController.sendContractToTenant);

export { contractRoutes };
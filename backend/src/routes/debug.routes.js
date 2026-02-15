import express from "express";
// CORREÇÃO: Importando o middleware com o nome correto
import { verifyToken } from "../src/middlewares/auth.middleware.js";

// Importa todos os models necessários
import Tenant from "../src/models/tenant.model.js";
import Property from "../src/models/property.model.js";
import Contract from "../src/models/contract.model.js";
import Payment from "../src/models/payment.model.js";
import Receipt from "../src/models/receipt.model.js";

const router = express.Router();

// SÓ CRIA ESTAS ROTAS SE O AMBIENTE NÃO FOR DE PRODUÇÃO
if (process.env.NODE_ENV !== "production") {
  // CORREÇÃO: Aplicando a segurança com o nome correto do middleware
  router.use(verifyToken);

  // Debug route: List all tenants
  router.get("/tenants", async (req, res) => {
    try {
      const data = await Tenant.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data." });
    }
  });

  // Debug route: List all properties
  router.get("/properties", async (req, res) => {
    try {
      const data = await Property.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data." });
    }
  });

  router.get("/contracts", async (req, res) => {
    try {
      const data = await Contract.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data." });
    }
  });

  router.get("/payments", async (req, res) => {
    try {
      const data = await Payment.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data." });
    }
  });

  router.get("/receipts", async (req, res) => {
    try {
      const data = await Receipt.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Error fetching data." });
    }
  });
}

export default router;

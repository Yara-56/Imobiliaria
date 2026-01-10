// controllers/payment.controller.js

import Payment from "../models/payment.model.js";
import Contract from "../models/contract.model.js";
import Tenant from "../models/tenant.model.js";

/**
 * Lista todos os pagamentos do sistema
 */
export const listPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant")
      .populate("contract");
    res.status(200).json(payments);
  } catch (error) {
    console.error("Erro ao listar pagamentos:", error);
    res.status(500).json({ error: "Erro ao buscar pagamentos." });
  }
};

/**
 * Cria um novo pagamento associado a um inquilino e contrato
 */
export const createPayment = async (req, res) => {
  try {
    const { tenantId, contractId, amount, date, description } = req.body;

    // Verifica se contrato e inquilino existem
    const tenant = await Tenant.findById(tenantId);
    const contract = await Contract.findById(contractId);

    if (!tenant || !contract) {
      return res
        .status(404)
        .json({ error: "Inquilino ou contrato não encontrado." });
    }

    // Criação do pagamento
    const payment = new Payment({
      tenant: tenantId,
      contract: contractId,
      amount,
      date,
      description,
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(400).json({ error: "Erro ao criar pagamento." });
  }
};

import { Request, Response } from "express";
import { prisma } from "../../../config/database.config.js";

// 📌 LISTAR CONTRATOS (Com Relações)
export const getContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { tenantId: req.user.tenantId },
      include: {
        property: { select: { title: true, address: true } },
        renter: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(contracts);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar contratos." });
  }
};

// 📌 CRIAR CONTRATO
export const createContract = async (req: Request, res: Response) => {
  try {
    const { propertyId, renterId, rentAmount, dueDay, startDate, paymentMethod, contractNumber } = req.body;

    const contract = await prisma.contract.create({
      data: {
        rentAmount: Number(rentAmount),
        dueDay: Number(dueDay),
        startDate: new Date(startDate),
        paymentMethod,
        contractNumber: contractNumber || `CNT-${Date.now()}`,
        propertyId,
        renterId,
        userId: req.user.id,
        tenantId: req.user.tenantId,
        status: "ACTIVE",
      },
      include: {
        property: { select: { title: true } },
        renter: { select: { name: true } }
      }
    });

    return res.status(201).json({ message: "Contrato criado!", data: contract });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar contrato." });
  }
};

// 📌 BUSCAR POR ID
export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contract = await prisma.contract.findFirst({
      where: { id, tenantId: req.user.tenantId },
      include: { property: true, renter: true }
    });

    if (!contract) return res.status(404).json({ message: "Contrato não encontrado." });
    return res.status(200).json(contract);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar detalhes." });
  }
};

// ✅ A FUNÇÃO QUE FALTAVA: ATUALIZAR STATUS
export const updateContractStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Usamos updateMany para garantir que o contrato pertence ao tenantLogado
    const updated = await prisma.contract.updateMany({
      where: { 
        id, 
        tenantId: req.user.tenantId 
      },
      data: { status }
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado ou sem permissão." });
    }

    return res.status(200).json({ message: "Status do contrato atualizado com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar status." });
  }
};

// 📌 DELETAR CONTRATO
export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.contract.deleteMany({
      where: { id, tenantId: req.user.tenantId }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({ message: "Contrato removido." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar." });
  }
};
import { Request, Response } from "express";
import { prisma } from "../../../config/database.config.js";

// 📌 Criar contrato
export const createContract = async (req: Request, res: Response) => {
  try {
    const { propertyId, landlordName, propertyAddress, rentAmount } = req.body;

    const contract = await prisma.contract.create({
      data: {
        landlordName,
        propertyAddress,
        rentAmount,
        propertyId,
        userId: req.user.id,         // ✅ era clientId/createdById
        tenantId: req.user.tenantId,
      },
    });

    return res.status(201).json(contract);
  } catch (error) {
    console.error("Erro ao criar contrato:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// 📌 Listar contratos do tenant
export const getContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        tenantId: req.user.tenantId,
      },
      include: {
        property: true,              // ✅ traz dados da propriedade
        user: true,                  // ✅ traz dados do usuário
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(contracts);
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// 📌 Buscar contrato por ID
export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findFirst({
      where: {
        id,
        tenantId: req.user.tenantId,
      },
      include: {
        property: true,              // ✅ traz dados da propriedade
        user: true,                  // ✅ traz dados do usuário
      },
    });

    if (!contract) {
      return res.status(404).json({ message: "Contrato não encontrado" });
    }

    return res.json(contract);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// 📌 Atualizar status do contrato
export const updateContractStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contract = await prisma.contract.updateMany({
      where: {
        id,
        tenantId: req.user.tenantId,  // ✅ segurança multi-tenant
      },
      data: {
        status,
      },
    });

    if (contract.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado" });
    }

    return res.json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// 📌 Deletar contrato
export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.contract.deleteMany({
      where: {
        id,
        tenantId: req.user.tenantId,  // ✅ segurança multi-tenant
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar contrato:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
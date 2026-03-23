import { Request, Response } from "express";
import { prisma } from "../../../config/database.config.js";

const propertySelect = {
  id: true,
  name: true,
  street: true,
  number: true,
  neighborhood: true,
  city: true,
  state: true,
  zipCode: true,
} as const;

export const getContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { tenantId: req.user.tenantId },
      include: {
        property: { select: propertySelect },
        renter: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ status: "success", data: { contracts } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar contratos." });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const {
      propertyId,
      renterId,
      rentAmount,
      dueDay,
      startDate,
      endDate,
      depositValue,
      paymentMethod,
      contractNumber,
      notes,
    } = req.body;

    const contract = await prisma.contract.create({
      data: {
        rentAmount: Number(rentAmount),
        dueDay: Number(dueDay),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        depositValue: depositValue ? Number(depositValue) : undefined,
        paymentMethod,
        contractNumber: contractNumber || `CNT-${Date.now()}`,
        notes,
        propertyId,
        renterId,
        userId: req.user.id,
        tenantId: req.user.tenantId,
        status: "ACTIVE",
      },
      include: {
        property: { select: propertySelect },
        renter: { select: { id: true, fullName: true } },
      },
    });

    return res
      .status(201)
      .json({ status: "success", message: "Contrato criado!", data: { contract } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar contrato." });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findFirst({
      where: { id, tenantId: req.user.tenantId },
      include: { property: true, renter: true },
    });

    if (!contract) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({ status: "success", data: { contract } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar detalhes." });
  }
};

export const updateContractStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.contract.updateMany({
      where: { id, tenantId: req.user.tenantId },
      data: { status },
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({ status: "success", message: "Status atualizado!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar status." });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.contract.deleteMany({
      where: { id, tenantId: req.user.tenantId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Contrato não encontrado." });
    }

    return res.status(200).json({ status: "success", message: "Contrato removido." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar." });
  }
};
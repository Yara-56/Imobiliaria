import { Request, Response, NextFunction } from "express";
import { prisma } from "@/infrastructure/database/prisma.client";
import { RenterStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class RenterController {
  // LISTAR
  async index(req: Request, res: Response) {
    const tenants = await prisma.renter.findMany({
      where: { tenantId: req.user.tenantId },
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ status: "success", data: { tenants } });
  }

  // CRIAR
  async create(req: Request, res: Response) {
    const { fullName, email, phone, cpf, plan, rentValue } = req.body;
    const renter = await prisma.renter.create({
      data: {
        fullName, email, phone, cpf,
        documentUrl: req.file ? `/uploads/properties/${req.file.filename}` : null,
        status: RenterStatus.ATIVO,
        tenantId: req.user.tenantId,
        notes: `Plano: ${plan}, Valor: R$ ${rentValue}`,
      },
    });
    return res.status(201).json({ status: "success", data: { renter } });
  }

  // RECIBO (Exemplo de como simplificar)
  async generateReceipt(req: Request, res: Response) {
    const { rentAmount, dueDate } = req.body;
    const receiptId = uuidv4().substring(0, 8).toUpperCase();
    
    // ... lógica do PDF que estava na rota vem para cá ...
    
    return res.json({ status: "success", message: "Recibo gerado" });
  }

  // DELETAR
  async delete(req: Request, res: Response) {
    await prisma.renter.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
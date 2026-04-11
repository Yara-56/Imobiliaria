import type { Request, Response } from "express";
import { prisma } from "@shared/infra/database/prisma.client.js";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class RenterController {
  async index(req: Request, res: Response) {
    const tenants = await prisma.renter.findMany({
      where: { tenantId: req.user.tenantId },
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ status: "success", data: { tenants } });
  }

  async create(req: Request, res: Response) {
    const { fullName, email, phone, cpf } = req.body;
    const renter = await prisma.renter.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        cpf: cpf || null,
        tenantId: req.user.tenantId,
      },
    });
    return res.status(201).json({ status: "success", data: { renter } });
  }

  async receipt(req: Request, res: Response) {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `recibo-${uuidv4()}.pdf`;
    const filePath = path.join(process.cwd(), "uploads", "receipts", fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(18).text("Recibo", { align: "center" });
    doc.end();
    stream.on("finish", () => {
      res.json({ status: "success", url: `/uploads/receipts/${fileName}` });
    });
  }
}

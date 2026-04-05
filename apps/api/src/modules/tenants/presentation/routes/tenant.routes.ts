import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import { prisma } from "../../../../shared/infra/database/prisma.client.js";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

const router = Router();

// ============================================
// CONFIGURAÇÃO DE UPLOAD E DIRETÓRIOS
// ============================================

const uploadDir = path.join(process.cwd(), "uploads", "tenants");
const receiptsDir = path.join(process.cwd(), "uploads", "receipts");

// Garante que as pastas existam
[uploadDir, receiptsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const renterId = req.params.id || "temp";
    const dir = path.join(uploadDir, renterId);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ============================================
// MIDDLEWARE DE VALIDAÇÃO
// ============================================

const validateRenterExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const renter = await prisma.renter.findUnique({
      where: { id: req.params.id },
    });

    if (!renter) {
      return res.status(404).json({ message: "Inquilino não encontrado" });
    }

    req.renter = renter; // Definido no seu index.d.ts
    next();
  } catch (error) {
    res.status(500).json({ message: "Erro ao validar inquilino" });
  }
};

// ============================================
// ROTAS DE INQUILINOS
// ============================================

/**
 * GET /tenants - Listar inquilinos da imobiliária (tenant)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const renters = await prisma.renter.findMany({
      where: { tenantId: req.user.tenantId },
      skip,
      take: limit,
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.renter.count({
      where: { tenantId: req.user.tenantId },
    });

    res.json({
      status: "success",
      data: { renters, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar inquilinos" });
  }
});

/**
 * POST /tenants - Criar novo inquilino
 */
router.post("/", upload.single("profilePhoto"), async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, cpf, plan, rentValue } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Nome e email são obrigatórios" });
    }

    const existing = await prisma.renter.findFirst({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email já cadastrado" });

    const renter = await prisma.renter.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        cpf: cpf || null,
        documentUrl: req.file ? `/uploads/tenants/${req.file.filename}` : null,
        status: "ATIVO",
        tenantId: req.user.tenantId,
        userId: req.user.id,
        notes: `Plano: ${plan || "Padrão"}, Valor: R$ ${rentValue || 0}`,
      }
    });

    res.status(201).json({ status: "success", data: { renter } });
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao criar inquilino" });
  }
});

// ============================================
// GERAÇÃO DE RECIBO (VINCULADO AO MODEL PAYMENT)
// ============================================

router.post("/:id/receipts", validateRenterExists, async (req: Request, res: Response) => {
  try {
    const { amount, dueDate, description, contractId, method } = req.body;

    if (!amount || !dueDate || !contractId) {
      return res.status(400).json({ message: "Dados financeiros incompletos" });
    }

    const renter = req.renter!;

    // 1. Criar o registro de Pagamento no Banco
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        referenceMonth: new Date().toLocaleString('pt-BR', { month: 'long' }),
        dueDate: new Date(dueDate),
        paymentDate: new Date(),
        method: (method as PaymentMethod) || "PIX",
        status: "PAGO" as PaymentStatus,
        contractId,
        renterId: renter.id,
        tenantId: req.user.tenantId,
        userId: req.user.id,
        notes: description
      }
    });

    // 2. Gerar PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const fileName = `recibo-${payment.id.substring(18)}.pdf`;
    const filePath = path.join(receiptsDir, fileName);
    const pdfUrl = `/uploads/receipts/${fileName}`;

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(22).font("Helvetica-Bold").text("RECIBO DE ALUGUEL", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).font("Helvetica").text(`Recebemos de: ${renter.fullName}`);
    doc.text(`Valor: R$ ${parseFloat(amount).toFixed(2)}`);
    doc.text(`Referente a: ${description || "Mensalidade de Aluguel"}`);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
    doc.moveDown(2);
    doc.text("__________________________________________", { align: "center" });
    doc.text("Assinatura do Locador", { align: "center" });
    doc.end();

    stream.on("finish", async () => {
      // 3. Salvar o PDF no model Document
      await prisma.document.create({
        data: {
          name: fileName,
          type: "OUTRO",
          url: pdfUrl,
          fileSize: fs.statSync(filePath).size,
          mimeType: "application/pdf",
          uploadedBy: req.user.id,
          paymentId: payment.id,
          renterId: renter.id,
          tenantId: req.user.tenantId
        }
      });

      // 4. Atualizar o Payment com o link do recibo
      await prisma.payment.update({
        where: { id: payment.id },
        data: { receiptUrl: pdfUrl }
      });

      res.status(201).json({ status: "success", pdfUrl });
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao processar recibo" });
  }
});

/**
 * DELETE /tenants/:id - Deletar inquilino e arquivos
 */
router.delete("/:id", validateRenterExists, async (req: Request, res: Response) => {
  try {
    const renterId = req.params.id;

    // Remove do banco (Cascade deletará Documents e Payments se configurado no Prisma)
    await prisma.renter.delete({ where: { id: renterId } });

    // Remove pasta física de uploads do inquilino
    const renterPath = path.join(uploadDir, renterId);
    if (fs.existsSync(renterPath)) {
      fs.rmSync(renterPath, { recursive: true, force: true });
    }

    res.json({ status: "success", message: "Removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar" });
  }
});

export default router;
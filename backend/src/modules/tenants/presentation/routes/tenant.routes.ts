// backend/src/modules/tenants/presentation/routes/tenant.routes.ts

import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/prisma";

const router = Router();

// ============================================
// CONFIGURAÇÃO DE UPLOAD
// ============================================

const uploadDir = path.join(process.cwd(), "uploads", "tenants");
const receiptsDir = path.join(process.cwd(), "uploads", "receipts");

// Criar diretórios se não existirem
[uploadDir, receiptsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configurar multer para upload de documentos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tenantId = req.params.id || req.body.tenantId;
    const tenantDir = path.join(uploadDir, tenantId);

    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }

    cb(null, tenantDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Filtro de tipos de arquivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".doc", ".docx"];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido. Use: JPEG, PNG, GIF, WEBP, PDF, DOC, DOCX"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ============================================
// MIDDLEWARE DE VALIDAÇÃO
// ============================================

const validateTenantExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenant = await prisma.renter.findUnique({
      where: { id: req.params.id },
    });

    if (!tenant) {
      return res.status(404).json({ message: "Inquilino não encontrado" });
    }

    // Agora TypeScript reconhece req.tenant
    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ message: "Erro ao validar inquilino" });
  }
};

// ============================================
// ROTAS DE INQUILINOS
// ============================================

/**
 * GET /tenants
 * Listar todos os inquilinos com paginação
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const tenants = await prisma.renter.findMany({
      where: {
        tenantId: req.user?.tenantId,
      },
      skip,
      take: limit,
      include: {
        documents: true,
        receipts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.renter.count({
      where: {
        tenantId: req.user?.tenantId,
      },
    });

    res.json({
      status: "success",
      data: {
        tenants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao listar inquilinos:", error);
    res.status(500).json({ message: "Erro ao listar inquilinos" });
  }
});

/**
 * GET /tenants/:id
 * Buscar inquilino por ID
 */
router.get("/:id", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const tenant = await prisma.renter.findUnique({
      where: { id: req.params.id },
      include: {
        documents: {
          orderBy: { createdAt: "desc" },
        },
        receipts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json({
      status: "success",
      data: { tenant },
    });
  } catch (error) {
    console.error("Erro ao buscar inquilino:", error);
    res.status(500).json({ message: "Erro ao buscar inquilino" });
  }
});

/**
 * POST /tenants
 * Criar novo inquilino com upload de foto de perfil
 */
router.post("/", upload.single("profilePhoto"), async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, cpf, preferredPaymentMethod, plan, rentValue, billingDay } =
      req.body;

    // Validações básicas
    if (!fullName || !email) {
      return res.status(400).json({ message: "Nome e email são obrigatórios" });
    }

    // Verificar se email já existe
    const existingTenant = await prisma.renter.findFirst({
      where: { email },
    });

    if (existingTenant) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const tenant = await prisma.renter.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        cpf: cpf || null,
        documentUrl: req.file ? `/uploads/tenants/${req.params.id}/${req.file.filename}` : null,
        status: "ACTIVE",
        tenantId: req.user?.tenantId || "default",
        notes: `Plano: ${plan || "Padrão"}, Valor: R$ ${rentValue || 0}`,
      },
      include: {
        documents: true,
      },
    });

    res.status(201).json({
      status: "success",
      data: { tenant },
      message: "Inquilino criado com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao criar inquilino:", error);
    res.status(400).json({ message: error.message || "Erro ao criar inquilino" });
  }
});

/**
 * PATCH /tenants/:id
 * Atualizar dados do inquilino
 */
router.patch(
  "/:id",
  validateTenantExists,
  upload.single("profilePhoto"),
  async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, cpf, status, notes } = req.body;

      const updateData: any = {};

      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      if (cpf) updateData.cpf = cpf;
      if (status) updateData.status = status;
      if (notes) updateData.notes = notes;
      if (req.file) updateData.documentUrl = `/uploads/tenants/${req.params.id}/${req.file.filename}`;

      const tenant = await prisma.renter.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          documents: true,
        },
      });

      res.json({
        status: "success",
        data: { tenant },
        message: "Inquilino atualizado com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar inquilino:", error);
      res.status(400).json({ message: error.message || "Erro ao atualizar inquilino" });
    }
  }
);

/**
 * DELETE /tenants/:id
 * Deletar inquilino
 */
router.delete("/:id", validateTenantExists, async (req: Request, res: Response) => {
  try {
    // Deletar documentos associados
    const documents = await prisma.document.findMany({
      where: { renterId: req.params.id },
    });

    for (const doc of documents) {
      const filePath = path.join(uploadDir, req.params.id, path.basename(doc.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Deletar inquilino
    await prisma.renter.delete({
      where: { id: req.params.id },
    });

    res.json({
      status: "success",
      message: "Inquilino deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar inquilino:", error);
    res.status(500).json({ message: "Erro ao deletar inquilino" });
  }
});

// ============================================
// ROTAS DE DOCUMENTOS
// ============================================

/**
 * POST /tenants/:id/documents
 * Upload de documentos (JPEG, PNG, PDF, DOC, DOCX)
 */
router.post(
  "/:id/documents",
  validateTenantExists,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo foi enviado" });
      }

      const { type } = req.body; // tipo: RG, CPF, COMPROVANTE_RENDA, etc

      const document = await prisma.document.create({
        data: {
          type: type || "OUTRO",
          url: `/uploads/tenants/${req.params.id}/${req.file.filename}`,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          renterId: req.params.id,
        },
      });

      res.status(201).json({
        status: "success",
        data: document,
        message: "Documento enviado com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao fazer upload do documento:", error);
      res.status(400).json({ message: error.message || "Erro ao fazer upload do documento" });
    }
  }
);

/**
 * GET /tenants/:id/documents
 * Listar documentos do inquilino
 */
router.get("/:id/documents", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      where: { renterId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      data: {
        documents,
        total: documents.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    res.status(500).json({ message: "Erro ao buscar documentos" });
  }
});

/**
 * DELETE /tenants/:id/documents/:docId
 * Deletar documento específico
 */
router.delete("/:id/documents/:docId", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.docId },
    });

    if (!document) {
      return res.status(404).json({ message: "Documento não encontrado" });
    }

    // Deletar arquivo do sistema de arquivos
    const filePath = path.join(uploadDir, req.params.id, path.basename(document.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar registro do banco
    await prisma.document.delete({
      where: { id: req.params.docId },
    });

    res.json({
      status: "success",
      message: "Documento deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
    res.status(500).json({ message: "Erro ao deletar documento" });
  }
});

// ============================================
// ROTAS DE RECIBOS
// ============================================

/**
 * POST /tenants/:id/receipts
 * Gerar recibo em PDF
 */
router.post("/:id/receipts", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const { rentAmount, dueDate, paymentDate, description, contractNumber } = req.body;

    if (!rentAmount || !dueDate) {
      return res.status(400).json({ message: "Valor do aluguel e data de vencimento são obrigatórios" });
    }

    const tenant = req.tenant as any;

    // Criar documento PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const receiptId = uuidv4();
    const fileName = `recibo-${receiptId}-${Date.now()}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Cabeçalho
    doc.fontSize(20).font("Helvetica-Bold").text("RECIBO DE ALUGUEL", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).font("Helvetica").text(`Recibo #${receiptId.substring(0, 8).toUpperCase()}`, {
      align: "center",
    });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Informações do Inquilino
    doc.fontSize(12).font("Helvetica-Bold").text("INFORMAÇÕES DO INQUILINO");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Nome: ${tenant.fullName}`);
    doc.text(`Email: ${tenant.email}`);
    if (tenant.phone) doc.text(`Telefone: ${tenant.phone}`);
    if (tenant.cpf) doc.text(`CPF: ${tenant.cpf}`);
    doc.moveDown(1);

    // Informações do Pagamento
    doc.fontSize(12).font("Helvetica-Bold").text("INFORMAÇÕES DO PAGAMENTO");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Valor: R$ ${parseFloat(rentAmount).toFixed(2)}`);
    doc.text(`Data de Vencimento: ${new Date(dueDate).toLocaleDateString("pt-BR")}`);
    if (paymentDate) {
      doc.text(`Data de Pagamento: ${new Date(paymentDate).toLocaleDateString("pt-BR")}`);
    }
    if (contractNumber) {
      doc.text(`Contrato: ${contractNumber}`);
    }
    if (description) {
      doc.text(`Descrição: ${description}`);
    }
    doc.moveDown(1);

    // Rodapé
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).font("Helvetica").text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      { align: "center" }
    );
    doc.text("Este é um documento gerado automaticamente pelo sistema ImobiSys", { align: "center" });

    doc.end();

    // Salvar no banco de dados após gerar o PDF
    stream.on("finish", async () => {
      try {
        const receipt = await prisma.receipt.create({
          data: {
            receiptNumber: receiptId,
            rentAmount: parseFloat(rentAmount),
            dueDate: new Date(dueDate),
            paymentDate: paymentDate ? new Date(paymentDate) : null,
            description: description || null,
            pdfUrl: `/uploads/receipts/${fileName}`,
            renterId: req.params.id,
            contractNumber: contractNumber || null,
          },
        });

        res.status(201).json({
          status: "success",
          data: receipt,
          message: "Recibo gerado com sucesso",
          pdfUrl: `/uploads/receipts/${fileName}`,
        });
      } catch (error) {
        console.error("Erro ao salvar recibo no banco:", error);
        res.status(500).json({ message: "Erro ao salvar recibo" });
      }
    });

    stream.on("error", (error) => {
      console.error("Erro ao gerar PDF:", error);
      res.status(500).json({ message: "Erro ao gerar PDF do recibo" });
    });
  } catch (error: any) {
    console.error("Erro ao gerar recibo:", error);
    res.status(400).json({ message: error.message || "Erro ao gerar recibo" });
  }
});

/**
 * GET /tenants/:id/receipts
 * Listar recibos do inquilino
 */
router.get("/:id/receipts", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const receipts = await prisma.receipt.findMany({
      where: { renterId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      status: "success",
      data: {
        receipts,
        total: receipts.length,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar recibos:", error);
    res.status(500).json({ message: "Erro ao buscar recibos" });
  }
});

/**
 * GET /tenants/:id/receipts/:receiptId
 * Baixar recibo em PDF
 */
router.get("/:id/receipts/:receiptId", validateTenantExists, async (req: Request, res: Response) => {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: req.params.receiptId },
    });

    if (!receipt) {
      return res.status(404).json({ message: "Recibo não encontrado" });
    }

    const filePath = path.join(receiptsDir, path.basename(receipt.pdfUrl));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Arquivo do recibo não encontrado" });
    }

    res.download(filePath, `recibo-${receipt.receiptNumber}.pdf`);
  } catch (error) {
    console.error("Erro ao baixar recibo:", error);
    res.status(500).json({ message: "Erro ao baixar recibo" });
  }
});

export default router;
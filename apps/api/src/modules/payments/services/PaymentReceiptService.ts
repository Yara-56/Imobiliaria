import { injectable } from "tsyringe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { DocumentType } from "@prisma/client"; // ✅ Importando o Enum oficial
import { prisma } from "@config/database.config.js";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

@injectable()
export class PaymentReceiptService {
  
  async execute(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        tenant: true,   
        renter: true,   
        user: true,     
        contract: true, 
      },
    });

    if (!payment) {
      throw new AppError({
        message: "Pagamento não encontrado.",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    const relativeFolder = path.join("uploads", "receipts", payment.tenantId);
    const fullDir = path.join(process.cwd(), relativeFolder);

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const fileName = `RECIBO_${payment.id}_${Date.now()}.pdf`;
    const filePath = path.join(fullDir, fileName);
    const publicUrl = `/${relativeFolder}/${fileName}`.replace(/\\/g, "/");

    // Setup do PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); 
    const { width, height } = page.getSize();
    
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Layout Header
    page.drawRectangle({
      x: 0, y: height - 60, width, height: 60,
      color: rgb(0.07, 0.12, 0.25),
    });

    page.drawText("COMPROVANTE DE PAGAMENTO", {
      x: 50, y: height - 38, size: 18, font: fontBold, color: rgb(1, 1, 1),
    });

    // QR Code
    const qrData = `${process.env.APP_URL || 'https://api.homeflux.com.br'}/verify/${payment.id}`;
    const qrCodeImageData = await QRCode.toDataURL(qrData);
    const qrImageBytes = Buffer.from(qrCodeImageData.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    page.drawImage(qrImage, {
      x: width - 120, y: height - 150, width: 70, height: 70,
    });

    let currentY = height - 100;

    const drawSection = (title: string, lines: string[], y: number) => {
      page.drawText(title, { x: 50, y, size: 11, font: fontBold, color: rgb(0.07, 0.12, 0.25) });
      let nextY = y - 18;
      lines.forEach(line => {
        page.drawText(line, { x: 50, y: nextY, size: 10, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        nextY -= 14;
      });
      return nextY - 15;
    };

    currentY = drawSection("DADOS DO EMISSOR", [
      `Imobiliária: ${payment.tenant.name}`,
      `CNPJ: ${payment.tenant.cnpj || "Não informado"}`
    ], currentY);

    currentY = drawSection("LOCATÁRIO", [
      `Nome: ${payment.renter.fullName}`,
      `CPF: ${payment.renter.cpf || "Não informado"}`
    ], currentY);

    currentY = drawSection("DETALHES DO PAGAMENTO", [
      `Valor: R$ ${payment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `Referência: ${payment.referenceMonth}`,
      `Método: ${payment.method}`
    ], currentY);

    // Texto de Quitação
    const footerText = `Confirmamos o recebimento de R$ ${payment.amount.toFixed(2).replace(".", ",")} referente ao aluguel mensal, dando plena quitação para o período de ${payment.referenceMonth}.`;
    
    page.drawText(footerText, {
      x: 50, y: currentY - 20, size: 9, font: fontRegular, maxWidth: width - 100, lineHeight: 13,
    });

    // Assinatura
    page.drawText("_______________________________________________", { x: 50, y: 100, size: 10 });
    page.drawText(payment.user?.name || "Responsável Financeiro", { x: 50, y: 85, size: 10, font: fontBold });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    // Persistência no Banco
    return await prisma.document.create({
      data: {
        name: `Recibo_${payment.referenceMonth.replace("/", "_")}`,
        type: DocumentType.PAYMENT_RECEIPT, // ✅ CORRIGIDO: Usando o Enum oficial do seu Schema
        url: publicUrl,
        fileKey: fileName,
        fileSize: pdfBytes.length,
        mimeType: "application/pdf",
        tenantId: payment.tenantId,
        renterId: payment.renterId,
        paymentId: payment.id, // Vincula o documento ao pagamento
      }
    });
  }
}
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { prisma } from "../../../infrastructure/database/prisma.client.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

export class PaymentReceiptService {
  /**
   * Gera um recibo profissional com QR Code e marca d'água
   */
  static async generateReceipt(paymentId: string) {
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
        message: "Pagamento não encontrado para gerar recibo.",
        statusCode: HttpStatus.NOT_FOUND
      });
    }

    // 1. Configuração de Diretório (Organizado por Inquilino)
    const relativeFolder = path.join("uploads", "receipts", payment.renterId);
    const fullDir = path.join(process.cwd(), relativeFolder);

    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }

    const fileName = `RECIBO_${payment.referenceMonth.replace("/", "-")}_${Date.now()}.pdf`;
    const filePath = path.join(fullDir, fileName);
    const publicUrl = `/${relativeFolder}/${fileName}`.replace(/\\/g, "/");

    // 2. Criação do PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // Tamanho A4 preciso
    const { width, height } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Design: Linha de topo (Header Decorativo)
    page.drawRectangle({
      x: 0,
      y: height - 60,
      width: width,
      height: 60,
      color: rgb(0.1, 0.2, 0.4),
    });

    page.drawText("COMPROVANTE DE PAGAMENTO", {
      x: 50,
      y: height - 40,
      size: 20,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // 3. QR Code de Autenticidade (Segurança para a imobiliária)
    const qrData = `${process.env.APP_URL}/verify/payment/${payment.id}`;
    const qrCodeImageData = await QRCode.toDataURL(qrData);
    const qrImageBytes = Buffer.from(qrCodeImageData.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrImageBytes);

    page.drawImage(qrImage, {
      x: width - 130,
      y: height - 180,
      width: 80,
      height: 80,
    });

    // 4. Conteúdo Principal
    let currentY = height - 100;

    const drawSection = (title: string, content: string[], yPos: number) => {
      page.drawText(title, { x: 50, y: yPos, size: 12, font: fontBold, color: rgb(0.1, 0.2, 0.4) });
      let lineY = yPos - 18;
      content.forEach(line => {
        page.drawText(line, { x: 50, y: lineY, size: 10, font: fontRegular });
        lineY -= 14;
      });
      return lineY - 10;
    };

    // Dados da Imobiliária
    currentY = drawSection("DADOS DO EMISSOR", [
      `Imobiliária: ${payment.tenant.name}`,
      `CNPJ: ${payment.tenant.cnpj || "Não informado"}`,
      `Contato: ${payment.tenant.email || "-"}`
    ], currentY);

    // Dados do Pagamento (O mais importante)
    currentY = drawSection("DETALHES DO PAGAMENTO", [
      `Valor: R$ ${payment.amount.toFixed(2).replace(".", ",")}`,
      `Mês de Referência: ${payment.referenceMonth}`,
      `Data de Pagamento: ${payment.paymentDate?.toLocaleDateString("pt-BR") || "N/A"}`,
      `Método: ${payment.method}`,
      `Contrato: ${payment.contract.contractNumber || "N/A"}`
    ], currentY);

    // Dados do Locatário
    currentY = drawSection("LOCATÁRIO", [
      `Nome: ${payment.renter.fullName}`,
      `CPF: ${payment.renter.cpf || "Não informado"}`,
    ], currentY);

    // 5. Texto de Quitação Legal
    const footerText = `Declaramos ter recebido a importância supra de R$ ${payment.amount.toFixed(2)}, referente ao aluguel e encargos do imóvel mencionado no contrato de locação, dando-lhe por este recibo a devida quitação para o período citado.`;
    
    page.drawText(footerText, {
      x: 50,
      y: currentY - 20,
      size: 9,
      font: fontRegular,
      maxWidth: width - 100,
      lineHeight: 12,
    });

    // 6. Assinatura Digital Simbolizada
    page.drawText("_______________________________________________", { x: width / 2 - 100, y: 100, size: 10 });
    page.drawText(`${payment.user.name}`, { x: width / 2 - 100, y: 85, size: 10, font: fontBold });
    page.drawText("Responsável Financeiro", { x: width / 2 - 100, y: 72, size: 8, font: fontRegular });

    // 7. Salvamento e Registro no Banco
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    // Registrar no Model Document (conforme seu Schema)
    const doc = await prisma.document.create({
      data: {
        name: `Recibo_${payment.referenceMonth.replace("/", "_")}`,
        type: "OUTRO",
        url: publicUrl,
        fileSize: pdfBytes.length,
        mimeType: "application/pdf",
        uploadedBy: payment.user.name,
        tenantId: payment.tenantId,
        renterId: payment.renterId,
        paymentId: payment.id,
      },
    });

    // Atualiza o pagamento com a URL do recibo gerado
    await prisma.payment.update({
      where: { id: payment.id },
      data: { receiptUrl: doc.url },
    });

    return doc;
  }
}
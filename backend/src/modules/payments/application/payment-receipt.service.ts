import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { prisma } from "@/infrastructure/database/prisma.client";
import QRCode from "qrcode";

export class PaymentReceiptService {
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

    if (!payment) return null;

    /* ----------------------------------------
        Diretório final do recibo
    ----------------------------------------- */

    const baseDir = path.join(
      process.cwd(),
      "uploads",
      "receipts",
      payment.renterId
    );

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    const fileName = `recibo-${payment.id}-${Date.now()}.pdf`;
    const filePath = path.join(baseDir, fileName);

    /* ----------------------------------------
        Criar PDF
    ----------------------------------------- */

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([595, 842]); // A4
    const { height } = page.getSize();
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    let y = height - 40;

    const write = (text: string, size = 12, color = rgb(0, 0, 0)) => {
      page.drawText(text, { x: 40, y, size, font, color });
      y -= size + 8;
    };

    /* ----------------------------------------
        QR CODE – validação/autenticidade
    ----------------------------------------- */

    const qrData = await QRCode.toDataURL(
      JSON.stringify({
        paymentId: payment.id,
        renterId: payment.renterId,
        tenantId: payment.tenantId,
        date: new Date().toISOString(),
      })
    );

    const qrImageBytes = Buffer.from(qrData.split(",")[1], "base64");
    const qrImage = await pdf.embedPng(qrImageBytes);

    page.drawImage(qrImage, {
      x: 440,
      y: y - 60,
      width: 120,
      height: 120,
    });

    /* ----------------------------------------
        Cabeçalho
    ----------------------------------------- */

    write("RECIBO DE PAGAMENTO – MODELO CONTRATUAL", 18);

    write(`Referente ao contrato nº: ${payment.contract.contractNumber}`);
    write("");

    /* ----------------------------------------
        Dados do Inquilino
    ----------------------------------------- */

    write("DADOS DO INQUILINO", 14);
    write(`Nome: ${payment.renter.fullName}`);
    write(`Email: ${payment.renter.email || "-"}`);
    write(`Telefone: ${payment.renter.phone || "-"}`);
    write(`CPF: ${payment.renter.cpf || "-"}`);
    write("");

    /* ----------------------------------------
        Dados do Pagamento
    ----------------------------------------- */

    write("DADOS DO PAGAMENTO", 14);
    write(`Valor pago: R$ ${payment.amount.toFixed(2)}`);
    write(`Referência: ${payment.referenceMonth}`);
    write(`Método: ${payment.method}`);
    write(`Status: ${payment.status}`);
    write(
      `Pagamento efetuado em: ${
        payment.paymentDate?.toLocaleDateString("pt-BR") || "Não informado"
      }`
    );
    write("");

    /* ----------------------------------------
        Dados do Contrato
    ----------------------------------------- */

    write("DADOS DO CONTRATO", 14);
    write(
      `Data de início: ${payment.contract.startDate.toLocaleDateString("pt-BR")}`
    );
    write(
      `Data de término: ${
        payment.contract.endDate?.toLocaleDateString("pt-BR") ||
        "Sem data definida"
      }`
    );
    write(`Dia de vencimento: ${payment.contract.dueDay}`);
    write(`Valor do aluguel: R$ ${payment.contract.rentAmount.toFixed(2)}`);
    write("");

    /* ----------------------------------------
        Dados da Imobiliária
    ----------------------------------------- */

    write("IMOBILIÁRIA RESPONSÁVEL", 14);
    write(`Empresa: ${payment.tenant.name}`);
    write(`Email: ${payment.tenant.email || "-"}`);
    write(`CNPJ: ${payment.tenant.cnpj || "-"}`);
    write("");

    /* ----------------------------------------
        Termos legais
    ----------------------------------------- */

    write("TERMOS DO CONTRATO", 14);

    const terms = `
Declaro, para os devidos fins, que o pagamento acima descrito foi recebido de acordo com 
as cláusulas estabelecidas no contrato de locação firmado entre as partes.

Este recibo serve como comprovação legal do pagamento, respeitando todas as regras 
definidas no contrato e a legislação vigente.
`;

    terms.split("\n").forEach((line) => {
      if (line.trim() !== "") write(line.trim(), 10);
    });

    write("");

    /* ----------------------------------------
        Assinatura
    ----------------------------------------- */

    write("________________________________________", 12);
    write(`${payment.user.name} – Responsável`, 10);

    /* ----------------------------------------
        Salvar PDF
    ----------------------------------------- */

    const pdfBytes = await pdf.save();
    fs.writeFileSync(filePath, pdfBytes);

    /* ----------------------------------------
        Registrar no banco (Document)
    ----------------------------------------- */

    const doc = await prisma.document.create({
      data: {
        name: `Recibo ${payment.referenceMonth}`,
        type: "OUTRO",
        url: `/uploads/receipts/${payment.renterId}/${fileName}`,
        fileSize: pdfBytes.length,
        mimeType: "application/pdf",
        tenantId: payment.tenantId,
        renterId: payment.renterId,
        paymentId: payment.id,
        uploadedBy: payment.userId,
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { receiptUrl: doc.url },
    });

    return doc;
  }
}
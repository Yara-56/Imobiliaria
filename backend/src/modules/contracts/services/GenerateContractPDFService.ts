import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { prisma } from "../../../infrastructure/database/prisma.client.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

export class GenerateContractPDFService {
  /**
   * Gera o PDF do contrato e salva o registro no Banco
   */
  async execute(contractId: string) {
    // 1. Busca os dados completos (Relacionamentos do MongoDB)
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        tenant: true,   // Imobiliária
        renter: true,   // Inquilino
        property: true, // Imóvel
        user: true,     // Usuário que gerou
      }
    });

    if (!contract) {
      throw new AppError({
        message: "Contrato não encontrado para gerar o PDF.",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    // 2. Configura o caminho do arquivo
    const fileName = `CONTRATO_${contract.contractNumber || contract.id.substring(0, 8)}.pdf`;
    const folderPath = path.resolve("uploads", "documents", contract.tenantId);
    
    // Cria a pasta se não existir
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, fileName);
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Stream para salvar o arquivo
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- CONTEÚDO DO PDF ---
    
    // Título
    doc.fontSize(18).font("Helvetica-Bold").text("CONTRATO DE LOCAÇÃO DE IMÓVEL", { align: "center" });
    doc.moveDown(2);

    // Cláusula 1: Partes
    doc.fontSize(12).font("Helvetica-Bold").text("1. DAS PARTES");
    doc.font("Helvetica").fontSize(10).text(
      `LOCADOR: ${contract.tenant.name}, inscrito no CNPJ sob nº ${contract.tenant.cnpj || "N/A"}, com sede em ${contract.tenant.phone || "N/A"}.`,
      { align: "justify" }
    );
    doc.moveDown(0.5);
    doc.text(
      `LOCATÁRIO: ${contract.renter.fullName}, inscrito no CPF sob nº ${contract.renter.cpf || "N/A"}, residente e domiciliado no imóvel objeto deste contrato.`,
      { align: "justify" }
    );
    doc.moveDown();

    // Cláusula 2: O Imóvel
    doc.font("Helvetica-Bold").text("2. DO OBJETO");
    doc.font("Helvetica").text(
      `O objeto deste contrato é a locação do imóvel situado em: ${contract.property.address}, ${contract.property.city || ""} - ${contract.property.state || ""}.`,
      { align: "justify" }
    );
    doc.moveDown();

    // Cláusula 3: Valores
    doc.font("Helvetica-Bold").text("3. DO VALOR E PAGAMENTO");
    doc.font("Helvetica").text(
      `O valor mensal do aluguel é de R$ ${contract.rentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago via ${contract.paymentMethod}, com vencimento todo dia ${contract.dueDay} de cada mês.`,
      { align: "justify" }
    );
    doc.moveDown();

    // Cláusula 4: Prazo
    const startDate = contract.startDate.toLocaleDateString('pt-BR');
    const endDate = contract.endDate ? contract.endDate.toLocaleDateString('pt-BR') : "Prazo indeterminado";
    doc.font("Helvetica-Bold").text("4. DO PRAZO");
    doc.font("Helvetica").text(
      `O contrato tem início em ${startDate} e término previsto em ${endDate}.`,
      { align: "justify" }
    );
    doc.moveDown(3);

    // Assinaturas
    doc.text("__________________________________________", { align: "center" });
    doc.text(contract.tenant.name + " (Locador)", { align: "center" });
    doc.moveDown(2);
    doc.text("__________________________________________", { align: "center" });
    doc.text(contract.renter.fullName + " (Locatário)", { align: "center" });

    // Finaliza o PDF
    doc.end();

    // 3. Salva a referência do documento no MongoDB
    await prisma.document.create({
      data: {
        name: fileName,
        type: "CONTRATO",
        url: `/uploads/documents/${contract.tenantId}/${fileName}`,
        fileSize: 0, 
        mimeType: "application/pdf",
        uploadedBy: contract.user.name,
        contractId: contract.id,
        renterId: contract.renterId,
        propertyId: contract.propertyId,
        tenantId: contract.tenantId
      }
    });

    return { 
      message: "Contrato gerado com sucesso", 
      url: `/uploads/documents/${contract.tenantId}/${fileName}` 
    };
  }
}
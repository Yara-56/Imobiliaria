// src/modules/payments/services/receiptGenerator.ts

import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface GenerateReceiptParams {
  paymentId: string;
  outputDir?: string;
}

/**
 * 🎯 Tipo profissional do payload do Prisma
 * Isso elimina TODOS os erros de "never"
 */
type PaymentWithRelations = Prisma.PaymentGetPayload<{
  include: {
    contract: {
      include: {
        renter: true;
        property: true;
        tenant: true;
      };
    };
  };
}>;

export class ReceiptGeneratorService {
  /**
   * 🚀 Gera recibo inteligente baseado no contrato
   */
  static async generate({ paymentId, outputDir }: GenerateReceiptParams) {
    // 🔎 Busca pagamento com tipagem forte
    const payment: PaymentWithRelations | null =
      await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          contract: {
            include: {
              renter: true,
              property: true,
              tenant: true,
            },
          },
        },
      });

    if (!payment) {
      throw new Error("Pagamento não encontrado");
    }

    if (!payment.contract) {
      throw new Error("Contrato não vinculado ao pagamento");
    }

    const { contract } = payment;
    const { renter, property, tenant } = contract;

    // ✅ DATA DE PAGAMENTO
    const paidAt = payment.paymentDate
      ? new Date(payment.paymentDate).toLocaleDateString("pt-BR")
      : "—";

    // 💰 formatação de moeda
    const formatMoney = (value: number) =>
      value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

    // 📄 conteúdo do recibo
    const receiptText = `
===============================
        RECIBO DE PAGAMENTO
===============================

🏢 Imobiliária: ${tenant?.name ?? "—"}
👤 Inquilino: ${renter?.name ?? "—"}
📄 CPF: ${renter?.cpf ?? "—"}

🏠 Imóvel: ${property?.title ?? "—"}
📍 Endereço: ${property?.address ?? "—"}

📅 Referência: ${payment.referenceMonth}
💰 Valor pago: ${formatMoney(payment.amount)}
📆 Data do pagamento: ${paidAt}
📌 Status: ${payment.status}

📑 Contrato: ${contract.id}

-------------------------------
Este recibo foi gerado automaticamente.
    `.trim();

    // 📁 diretório de saída
    const dir =
      outputDir ??
      path.resolve(process.cwd(), "storage", "receipts");

    await fs.mkdir(dir, { recursive: true });

    // 🧾 nome do arquivo
    const fileName = `recibo-${payment.id}.txt`;
    const filePath = path.join(dir, fileName);

    // 💾 salva arquivo
    await fs.writeFile(filePath, receiptText, "utf-8");

    return {
      fileName,
      filePath,
      content: receiptText,
    };
  }
}
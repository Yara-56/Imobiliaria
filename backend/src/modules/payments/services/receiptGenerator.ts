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

    const paidAt = payment.paymentDate
      ? new Date(payment.paymentDate).toLocaleDateString("pt-BR")
      : "—";

    const formatMoney = (value: number) =>
      value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

    const formattedAddress = property
      ? `${property.street}, ${property.number} - ${property.neighborhood}, ${property.city}/${property.state} - CEP ${property.zipCode}`
      : "—";

    const receiptText = `
===============================
        RECIBO DE PAGAMENTO
===============================

🏢 Imobiliária: ${tenant?.name ?? "—"}
👤 Inquilino: ${renter?.fullName ?? "—"}
📄 CPF: ${renter?.cpf ?? "—"}

🏠 Imóvel: ${property?.name ?? "—"}
📍 Endereço: ${formattedAddress}

📅 Referência: ${payment.referenceMonth}
💰 Valor pago: ${formatMoney(payment.amount)}
📆 Data do pagamento: ${paidAt}
📌 Status: ${payment.status}

📑 Contrato: ${contract.id}

-------------------------------
Este recibo foi gerado automaticamente.
    `.trim();

    const dir =
      outputDir ??
      path.resolve(process.cwd(), "storage", "receipts");

    await fs.mkdir(dir, { recursive: true });

    const fileName = `recibo-${payment.id}.txt`;
    const filePath = path.join(dir, fileName);

    await fs.writeFile(filePath, receiptText, "utf-8");

    return {
      fileName,
      filePath,
      content: receiptText,
    };
  }
}
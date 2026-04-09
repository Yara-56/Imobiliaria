import axios from "axios";
import { AppError } from "@shared/errors/AppError.js";
import { logger } from "@shared/utils/logger.js";
import { HttpStatus } from "@shared/errors/http-status.js";

export interface Signer {
  name: string;
  email: string;
  cpf?: string;
}

export class GovDigitalSignService {
  /**
   * Envia o contrato para assinatura real via Certifique.me
   */
  static async createSignatureRequest(pdfBuffer: Buffer, signers: Signer[], documentName: string) {
    try {
      const apiKey = process.env.CERTIFIQUEME_API_KEY;

      if (!apiKey) {
        throw new AppError({
          message: "Configuração de assinatura digital (API KEY) ausente.",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR // ✅ Corrigido
        });
      }

      const response = await axios.post(
        "https://api.certifique.me/v1/documents",
        {
          name: documentName,
          file_base64: pdfBuffer.toString("base64"),
          signers: signers.map(s => ({
            name: s.name,
            email: s.email,
            auth_type: "email_and_cpf",
            delivery_method: "email"
          })),
          webhook_url: `${process.env.APP_URL}/webhooks/signature`,
          sandbox: process.env.NODE_ENV !== "production"
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      return {
        externalId: response.data.id,
        signatureUrl: response.data.sign_url
      };

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message;
      logger.error({ msg: "Erro Certifique.me", details: errorMessage });

      throw new AppError({
        message: `Falha ao processar assinatura digital: ${errorMessage}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR // ✅ Corrigido
      });
    }
  }
}
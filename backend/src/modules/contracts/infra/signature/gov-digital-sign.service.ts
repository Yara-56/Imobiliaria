import axios from "axios";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";

export class GovDigitalSignService {
  static async createSignatureRequest(pdfBuffer: Buffer, signers: any[]) {
    try {
      const apiKey = process.env.CERTIFIQUEME_API_KEY;

      if (!apiKey) {
        throw new AppError("API KEY da Certifique.me não configurada.", 500);
      }

      const response = await axios.post(
        "https://api.certifique.me/documents",
        {
          file: pdfBuffer.toString("base64"),
          signers,
          callback_url: "https://homeflux.com.br/webhooks/signature"
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      logger.info({
        msg: "Documento enviado para Certifique.me",
        service: "Certifique.me"
      });

      return response.data;
    } catch (error: any) {
      logger.error({
        msg: "Erro ao enviar para Certifique.me",
        error: error?.response?.data || error.message
      });

      throw new AppError("Erro na assinatura digital.", 500);
    }
  }
}
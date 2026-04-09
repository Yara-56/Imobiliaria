import signer from "node-signpdf";
import fs from "fs";
import { AppError } from "@shared/errors/AppError.js";
import { logger } from "@shared/utils/logger.js";

export class LocalDigitalSignatureService {
  static signPDF(pdfBuffer: Buffer, certificatePath: string, password: string) {
    try {
      if (!fs.existsSync(certificatePath)) {
        // ✅ CORREÇÃO: Passando como um objeto { message, statusCode }
        throw new AppError({
          message: "Certificado não encontrado.",
          statusCode: 400
        });
      }

      const cert = fs.readFileSync(certificatePath);

      // Algumas versões do node-signpdf exigem o .default
      const signedPDF = (signer as any).sign(pdfBuffer, cert, {
        passphrase: password
      });

      logger.info({
        msg: "PDF assinado com certificado local",
        certificatePath
      });

      return signedPDF;
    } catch (error: any) {
      logger.error({ msg: "Erro ao assinar PDF", error: error.message });

      // ✅ CORREÇÃO: Passando como um objeto
      throw new AppError({
        message: "Falha ao assinar PDF.",
        statusCode: 500
      });
    }
  }
}
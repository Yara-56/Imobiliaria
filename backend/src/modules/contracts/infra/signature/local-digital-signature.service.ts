import signer from "node-signpdf";
import fs from "fs";
import { AppError } from "@/shared/errors/AppError";
import { logger } from "@/shared/utils/logger";

export class LocalDigitalSignatureService {
  static signPDF(pdfBuffer: Buffer, certificatePath: string, password: string) {
    try {
      if (!fs.existsSync(certificatePath)) {
        throw new AppError("Certificado não encontrado.", 400);
      }

      const cert = fs.readFileSync(certificatePath);

      const signedPDF = signer.sign(pdfBuffer, cert, {
        passphrase: password
      });

      logger.info({
        msg: "PDF assinado com certificado local",
        certificatePath
      });

      return signedPDF;
    } catch (error) {
      logger.error({ msg: "Erro ao assinar PDF", error });
      throw new AppError("Falha ao assinar PDF.", 500);
    }
  }
}
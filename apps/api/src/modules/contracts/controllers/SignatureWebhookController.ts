import { Request, Response } from "express";
import { prisma } from "../../../shared/infra/database/prisma.client.js"; // ✅ 3 níveis apenas
import { logger } from "../../../shared/utils/logger.js"; // ✅ Ajustado para 3 níveis

export class SignatureWebhookController {
  async handle(req: Request, res: Response) {
    try {
      const { event, document_id, signed_file_url } = req.body;

      logger.info({ msg: "Webhook de assinatura recebido", event, document_id });

      // Verificamos se o evento é de 'document_signed' (documento assinado)
      if (event === "document_signed" || event === "document_completed") {
        
        // 1. Procuramos o contrato que tem esse document_id (externalId)
        const contract = await prisma.contract.findFirst({
          where: { 
            // Você precisará salvar o externalId no Contrato ao criá-lo
            // ou buscar pelo Document que gerou
            documents: { some: { name: { contains: document_id } } }
          }
        });

        if (contract) {
          // 2. Atualizamos o status para ACTIVE e salvamos a URL do arquivo assinado
          await prisma.contract.update({
            where: { id: contract.id },
            data: { 
              status: "ACTIVE",
              notes: contract.notes + `\n[Assinado digitalmente em ${new Date().toLocaleString()}]`
            }
          });

          // 3. Atualizamos o registro do documento com a URL final assinada
          await prisma.document.updateMany({
            where: { contractId: contract.id, type: "CONTRATO" },
            data: { url: signed_file_url }
          });

          logger.info({ msg: "Contrato ativado via Webhook", contractId: contract.id });
        }
      }

      // O Webhook SEMPRE deve responder 200 OK para a API não tentar reenviar
      return res.status(200).send();
    } catch (error) {
      logger.error({ msg: "Erro no Webhook de Assinatura", error });
      return res.status(200).send(); // Mantemos 200 para evitar loops de erro da API
    }
  }
}
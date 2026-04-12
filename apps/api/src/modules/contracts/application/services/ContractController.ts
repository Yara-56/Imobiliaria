import { Request, Response } from "express";
import { prisma } from "@config/database.config.js";
import { ContractService } from "./ContractService.js";

export class ContractController {
  private contractService: ContractService;

  constructor() {
    this.contractService = new ContractService();
  }

  /**
   * Rota HTTP: POST /api/contracts/send
   * Corpo esperado: { tenantId: "id_do_inquilino", documentUrl: "https://seu-s3.com/pdf" }
   */
  public sendContractToTenant = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tenantId, documentUrl } = req.body;

      if (!tenantId || !documentUrl) {
        return res.status(400).json({ error: "O ID do inquilino e a URL do documento são obrigatórios." });
      }

      // 1. Busca os dados reais do inquilino usando o Prisma
      const tenant = await prisma.renter.findUnique({
        where: { id: tenantId }
      });

      if (!tenant) {
        return res.status(404).json({ error: "Inquilino não encontrado no banco de dados." });
      }

      if (!tenant.email) {
        return res.status(400).json({ error: "O inquilino não possui um e-mail cadastrado para assinar o contrato." });
      }

      // 2. Dispara a lógica de negócio do nosso Service (ZapSign + Resend)
      await this.contractService.generateAndSendContract(
        tenant.email,
        tenant.fullName,
        documentUrl
      );

      return res.status(200).json({ message: "Contrato gerado e enviado com sucesso!" });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao processar o envio do contrato." });
    }
  };
}
import axios from "axios";
import { Resend } from "resend";
import { AppError } from "@shared/errors/AppError.js";
import { HttpStatus } from "@shared/errors/http-status.js";

// ======================================================
// 📦 TIPAGENS (Interfaces)
// ======================================================
interface ZapSignSigner {
  name: string;
  email: string;
  auth_mode: string;
  sign_url?: string;
}

interface ZapSignDocResponse {
  signers: ZapSignSigner[];
}

// ======================================================
// ⚙️ SERVICE
// ======================================================
export class ContractService {
  private resend: Resend;
  private zapSignToken: string;

  constructor() {
    // ⚠️ ATENÇÃO: As chaves devem vir do process.env no ambiente de produção
    this.resend = new Resend(process.env.RESEND_API_KEY || "re_ge4yPjbg_Nkv8a8de5DmpQAt5WXNfaCBt");
    this.zapSignToken = process.env.ZAPSIGN_API_TOKEN || "c52866a1-2775-48ee-9616-41b5512718e9f1ccdc84-0f6a-4e98-8713-e8f89fe1cf9d";
  }

  /**
   * Gera o contrato na ZapSign e envia o link via E-mail (Resend)
   */
  async generateAndSendContract(tenantEmail: string, tenantName: string, documentUrl: string): Promise<void> {
    try {
      // ----------------------------------------------------
      // PASSO 1: Criar o documento na ZapSign
      // ----------------------------------------------------
      const zapSignResponse = await axios.post<ZapSignDocResponse>(
        `https://api.zapsign.com.br/api/v1/docs/?api_token=${this.zapSignToken}`,
        {
          name: `Contrato de Locação - ${tenantName}`,
          url_pdf: documentUrl,
          signers: [
            {
              name: tenantName,
              email: tenantEmail,
              auth_mode: "assinatura_tela" // Método solicitado no prompt
            }
          ],
          lang: "pt-br"
        }
      );

      // Extrai o link mágico de assinatura
      const signUrl = zapSignResponse.data.signers[0].sign_url;

      if (!signUrl) throw new Error("A ZapSign não retornou um link de assinatura.");

      // ----------------------------------------------------
      // PASSO 2: Enviar o e-mail transacional via Resend
      // ----------------------------------------------------
      await this.resend.emails.send({
        from: "HomeFlux <contato@homeflux.com.br>",
        to: tenantEmail,
        subject: "Seu contrato de locação está pronto para assinatura",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0;">Olá, ${tenantName}!</h2>
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">Seu contrato de locação já está disponível para assinatura digital. O processo é rápido, seguro e tem validade jurídica.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${signUrl}" style="background-color: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Assinar Contrato Agora</a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 14px; text-align: center;">Se você tiver alguma dúvida, basta responder a este e-mail.</p>
          </div>
        `
      });
    } catch (error: any) {
      console.error("[ContractService] Erro na integração:", error?.response?.data || error.message);
      throw new AppError({ message: "Falha ao gerar e enviar o contrato.", statusCode: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }
}
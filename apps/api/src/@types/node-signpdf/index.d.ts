/**
 * 🖋️ Definição de Tipos para Assinatura Digital (node-signpdf)
 * Essencial para garantir a validade jurídica dos contratos da imobiliária.
 */

declare module "node-signpdf" {
  export interface SignPdfOptions {
    /** Senha do certificado digital (P12/PFX) */
    passphrase?: string;
    /** Motivo da assinatura (ex: "Assinatura do Locatário") */
    reason?: string;
    /** Cidade/Estado da assinatura */
    location?: string;
    /** E-mail ou telefone para contato do assinante */
    contactInfo?: string;
  }

  /**
   * Assina um PDF utilizando um certificado digital.
   * @param pdfBuffer O Buffer do arquivo PDF original
   * @param certificate O Buffer do certificado digital (.p12)
   * @param options Configurações adicionais de assinatura
   * @returns Buffer do PDF assinado digitalmente
   */
  export function sign(
    pdfBuffer: Buffer,
    certificate: Buffer,
    options?: SignPdfOptions
  ): Buffer;

  const signpdf: {
    sign: typeof sign;
  };

  export default signpdf;
}
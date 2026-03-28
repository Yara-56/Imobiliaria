declare module "node-signpdf" {
    export interface SignPdfOptions {
      passphrase?: string;
      reason?: string;
      location?: string;
      contactInfo?: string;
    }
  
    export function sign(
      pdfBuffer: Buffer,
      certificate: Buffer,
      options?: SignPdfOptions
    ): Buffer;
  
    const _default: {
      sign: typeof sign;
    };
  
    export default _default;
  }
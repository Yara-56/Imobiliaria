import { chromium, Browser } from "playwright";

export class PDFService {
  private static browser: Browser | null = null;

  // Reutiliza uma única instância do browser (performance SaaS)
  private static async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
        ],
      });
    }
    return this.browser;
  }

  static async generate(html: string): Promise<Buffer> {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle",
        timeout: 15000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "15mm",
          right: "15mm",
        },
      });

      await page.close();
      return pdfBuffer;

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      throw new Error("Falha ao gerar PDF");
    }
  }
}
import { chromium } from "playwright";

export class PDFService {
  static async generate(html: string): Promise<Buffer> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    await browser.close();
    return pdf;
  }
}
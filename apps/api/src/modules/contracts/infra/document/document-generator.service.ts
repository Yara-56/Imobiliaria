// src/modules/contracts/infra/document/document-generator.service.ts

import fs from "fs";
import Handlebars from "handlebars";
import { chromium } from "playwright";

export class DocumentGeneratorService {
  static async generatePDF(contract: any): Promise<Buffer> {
    const templateFile = fs.readFileSync(
      `src/modules/contracts/infra/template/templates/default-contract.hbs`,
      "utf8"
    );

    const html = Handlebars.compile(templateFile)({
      contract,
      today: new Date().toLocaleDateString("pt-BR"),
    });

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();
    return pdf;
  }
}
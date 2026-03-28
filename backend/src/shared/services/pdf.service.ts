import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export class PDFService {
  static generatePDF(filePath: string, content: (doc: PDFKit.PDFDocument) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      content(doc);

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }
}
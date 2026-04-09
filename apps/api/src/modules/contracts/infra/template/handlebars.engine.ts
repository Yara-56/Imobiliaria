import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { AppError } from "@/shared/errors/AppError.js";

export class TemplateEngine {
  /**
   * Carrega um template .hbs da pasta de templates
   */
  static loadTemplate(templateName: string): string {
    try {
      const filePath = path.resolve(
        "src/modules/contracts/infra/template/templates",
        `${templateName}.hbs`
      );

      if (!fs.existsSync(filePath)) {
        throw new AppError(`Template '${templateName}' não encontrado.`, 404);
      }

      return fs.readFileSync(filePath, "utf8");
    } catch (error) {
      throw new AppError("Erro ao carregar template de contrato.", 500);
    }
  }

  /**
   * Compila e injeta dados no template
   */
  static compile(template: string, data: any): string {
    try {
      const compiled = Handlebars.compile(template);
      return compiled(data);
    } catch (error) {
      throw new AppError("Erro ao compilar template de contrato.", 500);
    }
  }
}
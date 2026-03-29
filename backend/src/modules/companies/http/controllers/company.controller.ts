import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCompanyService } from "../../application/services/createCompany.service.js";
import { GetCompanyService } from "../../application/services/getCompany.service.js";

export class CompanyController {
  // =========================
  // CREATE
  // =========================
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, cnpj } = req.body;

      const service = container.resolve(CreateCompanyService);

      const company = await service.execute({ name, cnpj });

      return res.status(201).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Erro ao criar empresa",
      });
    }
  }

  // =========================
  // GET BY ID
  // =========================
  async get(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const service = container.resolve(GetCompanyService);

      const company = await service.execute(id);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Empresa não encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Erro ao buscar empresa",
      });
    }
  }
}
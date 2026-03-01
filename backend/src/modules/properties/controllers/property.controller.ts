import { Request, Response, NextFunction } from "express";
// ✅ Caminho corrigido para 3 níveis conforme sua árvore de pastas
import { prisma } from "../../../config/database.config.js"; 
import { AppError } from "../../../shared/errors/AppError.js";
import { HttpStatus } from "../../../shared/errors/http-status.js";

/**
 * 📄 LISTAR TODOS OS IMÓVEIS
 * Retorna apenas os imóveis pertencentes à imobiliária do usuário logado.
 */
export const getAllProperties = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const properties = await prisma.property.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(HttpStatus.OK).json({
      status: "success",
      results: properties.length,
      data: { properties }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ➕ CRIAR IMÓVEL
 */
export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, address, price, status, description, type } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        address,
        price,
        status,
        description,
        type,
        tenantId: req.user.tenantId, // 🛡️ Vínculo obrigatório com o Tenant
      },
    });

    res.status(HttpStatus.CREATED).json({
      status: "success",
      data: { property }
    });
  } catch (error: any) {
    next(new AppError({ 
      message: `Erro ao criar imóvel: ${error.message}`, 
      statusCode: HttpStatus.BAD_REQUEST 
    }));
  }
};

/**
 * 🔍 BUSCAR IMÓVEL POR ID
 */
export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findFirst({
      where: { 
        id, 
        tenantId: req.user.tenantId // 🛡️ Garante que não veja imóveis de outros tenants
      }
    });

    if (!property) {
      throw new AppError({ 
        message: "Imóvel não encontrado ou você não tem permissão.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    res.status(HttpStatus.OK).json({
      status: "success",
      data: { property }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ✏️ ATUALIZAR IMÓVEL
 */
export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // No Prisma + MongoDB/SQL, usamos updateMany para filtrar por ID e Tenant simultaneamente
    const updateResult = await prisma.property.updateMany({
      where: { 
        id, 
        tenantId: req.user.tenantId 
      },
      data: updateData
    });

    if (updateResult.count === 0) {
      throw new AppError({ 
        message: "Imóvel não encontrado para atualização.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    const updatedProperty = await prisma.property.findUnique({ where: { id } });

    res.status(HttpStatus.OK).json({
      status: "success",
      data: { property: updatedProperty }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🗑️ DELETAR IMÓVEL
 */
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleteResult = await prisma.property.deleteMany({
      where: { 
        id, 
        tenantId: req.user.tenantId 
      }
    });

    if (deleteResult.count === 0) {
      throw new AppError({ 
        message: "Imóvel não encontrado para exclusão.", 
        statusCode: HttpStatus.NOT_FOUND 
      });
    }

    res.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};
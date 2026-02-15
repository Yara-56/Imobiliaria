import * as propertyService from "./property.service.js";

/**
 * @desc    Criar novo imóvel vinculado ao tenant logado
 */
export const create = async (req, res, next) => {
  try {
    // req.tenantId vem do middleware 'protect' que refatoramos
    const property = await propertyService.createProperty(
      req.body,
      req.tenantId
    );

    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar imóveis com suporte a paginação
 */
export const list = async (req, res, next) => {
  try {
    // Passamos o req.query para o service lidar com page/limit
    const result = await propertyService.getAllProperties(
      req.tenantId,
      req.query 
    );

    res.status(200).json({
      status: "success",
      results: result.properties.length,
      total: result.total,
      pages: result.pages,
      data: result.properties,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Buscar imóvel específico (o Service já valida o tenant)
 */
export const getById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(
      req.params.id,
      req.tenantId
    );

    // Nota: O check de !property não é mais necessário aqui 
    // porque o service agora lança AppError 404 automaticamente.

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualizar imóvel de forma segura
 */
export const update = async (req, res, next) => {
  try {
    const property = await propertyService.updateProperty(
      req.params.id,
      req.body,
      req.tenantId
    );

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remover imóvel (Soft delete ou Hard delete)
 */
export const remove = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(
      req.params.id,
      req.tenantId
    );

    // 204 No Content é o padrão REST correto para deletes bem sucedidos
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
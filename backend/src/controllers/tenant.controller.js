// backend/controllers/tenant.controller.js

import Tenant from "../models/tenant.model.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Diretório de uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

// ================================
// LISTAR TODOS OS INQUILINOS
// ================================
export const listTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    console.error("Erro ao listar inquilinos:", error);
    res.status(500).json({ error: "Failed to fetch tenants." });
  }
};

// ================================
// OBTER INQUILINO POR ID
// ================================
export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found." });
    res.json(tenant);
  } catch (error) {
    console.error("Erro ao buscar inquilino:", error);
    res.status(500).json({ error: "Failed to fetch tenant." });
  }
};

// ================================
// CRIAR NOVO INQUILINO
// ================================
export const createTenant = async (req, res) => {
  const { body, files } = req;

  // Processa documentos enviados
  const documents = (files || []).map((file) => ({
    name: file.originalname,
    url: `/uploads/${file.filename}`,
  }));

  try {
    const newTenant = new Tenant({
      ...body,
      documents,
    });
    await newTenant.save();
    res.status(201).json(newTenant);
  } catch (error) {
    // Em caso de erro, remove arquivos enviados
    for (const file of files || []) {
      await fs.unlink(path.join(uploadDir, file.filename)).catch(console.error);
    }
    console.error("Erro ao criar inquilino:", error);
    res.status(400).json({ error: "Failed to create tenant. Check data format." });
  }
};

// ================================
// ATUALIZAR INQUILINO
// ================================
export const updateTenant = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const newFiles = req.files;

  try {
    const tenant = await Tenant.findById(id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found." });

    // Adiciona novos documentos se houver
    if (newFiles && newFiles.length > 0) {
      const newDocuments = newFiles.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
      }));
      tenant.documents.push(...newDocuments);
    }

    // Atualiza os campos do corpo do formulário
    Object.assign(tenant, updateData);

    const updatedTenant = await tenant.save();
    res.status(200).json(updatedTenant);
  } catch (error) {
    // Remove arquivos enviados se houver erro
    for (const file of newFiles || []) {
      await fs.unlink(path.join(uploadDir, file.filename)).catch(console.error);
    }
    console.error("Erro ao atualizar inquilino:", error);
    res.status(400).json({
      error: error.message || "Failed to update tenant. Check data format.",
    });
  }
};

// ================================
// DELETAR INQUILINO
// ================================
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ error: "Tenant not found." });

    // Remove arquivos do upload
    if (tenant.documents && tenant.documents.length > 0) {
      for (const doc of tenant.documents) {
        const filename = path.basename(doc.url);
        await fs.unlink(path.join(uploadDir, filename)).catch(err =>
          console.error(`Falha ao deletar arquivo ${filename}:`, err)
        );
      }
    }

    res.status(200).json({ message: "Tenant deleted successfully." });
  } catch (error) {
    console.error("Erro ao deletar inquilino:", error);
    res.status(500).json({ error: "Failed to delete tenant." });
  }
};

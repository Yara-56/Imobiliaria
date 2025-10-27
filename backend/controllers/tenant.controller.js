// backend/controllers/tenant.controller.js

import Tenant from "../models/tenant.model.js";
import fs from "fs/promises";
import path from "path";

// --- Utilitário de diretório (necessário para deletar arquivos, se for o caso) ---
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");

// Listar todos os inquilinos
export const listTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tenants." });
  }
};

// Obter inquilino por ID (Necessário para a tela de edição)
export const getTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tenant." });
  }
};

// Criar um novo inquilino (Agora processa req.body e req.files)
export const createTenant = async (req, res) => {
  const { body, files } = req; // Adiciona os documentos ao corpo, se existirem
  const documents = (files || []).map((file) => ({
    name: file.originalname,
    url: `/uploads/${file.filename}`,
  }));

  try {
    const newTenant = new Tenant({
      ...body,
      documents: documents, // Inclui os novos documentos
    });
    await newTenant.save();
    res.status(201).json(newTenant);
  } catch (error) {
    // Se houver erro de validação, deleta os arquivos recém-uploadados
    for (const file of files || []) {
      await fs.unlink(path.join(uploadDir, file.filename)).catch(console.error);
    }
    console.error("Erro ao criar inquilino:", error);
    res
      .status(400)
      .json({ error: "Failed to create tenant. Please check data format." });
  }
};

// --- FUNÇÃO CORRIGIDA: ATUALIZAR INQUILINO (PUT) ---
export const updateTenant = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const newFiles = req.files; // Arquivos salvos pelo Multer (chave 'files' em vez de 'newFiles')

  try {
    // 1. Encontra o inquilino
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    } // 2. Processa os NOVOS documentos

    if (newFiles && newFiles.length > 0) {
      const newDocuments = newFiles.map((file) => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`, // URL de acesso para o frontend
      }));
      tenant.documents.push(...newDocuments);
    } // 3. Atualiza os campos de texto // O Object.assign ou loop manual garantirá que apenas os campos do formulário sejam atualizados

    Object.assign(tenant, updateData); // 4. Salva no banco

    const updatedTenant = await tenant.save();
    res.status(200).json(updatedTenant);
  } catch (error) {
    // Se houver erro de validação, deleta os arquivos recém-uploadados
    for (const file of newFiles || []) {
      await fs.unlink(path.join(uploadDir, file.filename)).catch(console.error);
    }
    console.error("Erro ao atualizar inquilino:", error);
    res.status(400).json({
      error: error.message || "Failed to update tenant. Check data format.",
    });
  }
};

// --- FUNÇÃO DELETAR INQUILINO (DELETE) ---
export const deleteTenant = async (req, res) => {
  try {
    // Implementação ideal:
    // 1. Encontrar o inquilino
    // 2. Deletar todos os arquivos associados da pasta 'uploads'
    // 3. Deletar o registro no MongoDB
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    // Opcional, mas recomendado: Limpar arquivos físicos
    // if (tenant.documents && tenant.documents.length > 0) {
    //    for (const doc of tenant.documents) {
    //        const filename = path.basename(doc.url);
    //        await fs.unlink(path.join(uploadDir, filename)).catch(err => console.error(`Failed to delete file ${filename}:`, err));
    //    }
    // }

    res.status(200).json({ message: "Tenant deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tenant." });
  }
};

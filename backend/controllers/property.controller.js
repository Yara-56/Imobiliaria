// backend/controllers/property.controller.js
import Property from "../models/property.model.js";
import User from "../models/user.model.js"; // <-- 1. IMPORTADO O USER MODEL

// =========================================================
// 🚀 NOVAS FUNÇÕES ADICIONADAS
// =========================================================

/**
 * BUSCAR TIPOS DE IMÓVEL (Para dropdowns)
 * GET /properties/tipos
 */
export const getPropertyTypes = async (req, res) => {
  try {
    // Em uma aplicação grande, isso viria de uma coleção "PropertyType"
    // Por enquanto, uma lista estática (hardcoded) resolve o 404 e faz o
    // seu formulário funcionar.
    const types = [
      { id: "Apartamento", name: "Apartamento" },
      { id: "Casa", name: "Casa" },
      { id: "Loja", name: "Loja" },
      { id: "Terreno", name: "Terreno" },
      { id: "Comercial", name: "Comercial" },
      { id: "Rural", name: "Rural" },
    ];
    res.json(types);
  } catch (error) {
    console.error("Error fetching property types:", error);
    res.status(500).json({ error: "Error fetching property types." });
  }
};

/**
 * BUSCAR AGENTES/CORRETORES (Para dropdowns)
 * GET /properties/agentes
 */
export const getPropertyAgents = async (req, res) => {
  try {
    // Busca usuários que SÃO 'admin' ou 'agent'.
    // **Ajuste o campo 'role'** se o nome for diferente no seu model.
    const agents = await User.find({
      role: { $in: ["admin", "agent"] }, // Assumindo que você tem um campo 'role'
    })
      .select("name email _id") // Retorna apenas os campos úteis
      .lean();

    if (!agents.length) {
      // Se não achar ninguém, retorna um fallback para não quebrar o frontend
      return res.json([{ _id: "default_user", name: "Usuário Admin" }]);
    }

    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Error fetching agents." });
  }
};

// =========================================================
// (O RESTO DO SEU CÓDIGO ORIGINAL)
// =========================================================

/**
 * LISTAR + BUSCAR + PAGINAR
 * GET ?cep=...&sqls=...&q=...&status=...&page=1&limit=20
 */
export const listProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, cep, sqls, q, status } = req.query;

    const filter = {};
    if (cep) filter.cep = new RegExp(escapeRegex(cep), "i");
    if (sqls) filter.sqls = new RegExp(escapeRegex(sqls), "i");
    if (status) filter.status = status; // "Available" | "Occupied" | "Under Maintenance"

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      // pesquisar no campo correto do Model
      filter.$or = [{ cep: rx }, { sqls: rx }, { street: rx }, { city: rx }, { bairro: rx }];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Property.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Error fetching properties." });
  }
};

/** Util: normaliza req.files para array (suporta array/fields/any) */
function getAllUploadedFiles(req) {
  if (!req || !req.files) return [];
  if (Array.isArray(req.files)) return req.files;
  // req.files como objeto: { fieldName: [File, ...], ... }
  return Object.values(req.files).flat();
}

/**
 * CRIAR (ACEITA JSON OU MULTIPART)
 * POST /properties
 */
export const createProperty = async (req, res) => {
  try {
    const body = normalizeBody(req.body);

    // converte arquivos -> { name, url } (funciona para .array() e .fields())
    const fileDocs = getAllUploadedFiles(req).map(toDoc);

    // JSON -> normaliza para { name, url }
    const jsonDocs = Array.isArray(body.documents)
      ? body.documents.map(asDocObject)
      : [];

    const payload = {
      cep: body.cep,
      sqls: body.sqls,
      street: body.street,
      number: body.number,
      // persistimos em 'bairro' (aceita alias)
      bairro: firstNonEmpty(body.bairro, body.district, body.neighborhood),
      city: body.city,
      state: body.state,
      status: validOrDefaultStatus(body.status),
      documents: [...jsonDocs, ...fileDocs], // pode ser []
    };

    const created = await Property.create(payload);
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(400).json({
      error: "Error creating property.",
      message: error.message,
      fields: error.errors ?? undefined,
    });
  }
};

/**
 * DETALHES
 * GET /properties/:id
 */
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) return res.status(44).json({ error: "Property not found." });
    res.json(property);
  } catch (err) {
    console.error("Error getting property:", err);
    res.status(400).json({ error: "Invalid id." });
  }
};

/**
 * EDITAR PARCIAL (ACEITA JSON OU MULTIPART)
 * PATCH /properties/:id
 * - novos arquivos/documentos são agregados
 */
export const updateProperty = async (req, res) => {
  try {
    const body = normalizeBody(req.body);

    // mapeia aliases -> bairro (persistência padronizada)
    const mapped = { ...body };
    const mappedBairro = firstNonEmpty(body.bairro, body.district, body.neighborhood);
    if (mappedBairro) mapped.bairro = mappedBairro;
    delete mapped.district;
    delete mapped.neighborhood;

    const allowed = ["cep","sqls","street","number","bairro","city","state","status","documents"];
    const data = Object.fromEntries(
      Object.entries(mapped).filter(([k]) => allowed.includes(k))
    );

    if (data.status) data.status = validOrDefaultStatus(data.status);

    // normaliza documentos vindos via JSON
    if (Array.isArray(data.documents)) {
      data.documents = data.documents.map(asDocObject);
    }

    // converte arquivos e agrega
    const fileDocs = getAllUploadedFiles(req).map(toDoc);
    if (fileDocs.length) {
      const current = Array.isArray(data.documents) ? data.documents : [];
      data.documents = [...current, ...fileDocs];
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "Property not found." });
    res.json(updated);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(400).json({
      error: "Error updating property.",
      message: error.message,
      fields: error.errors ?? undefined,
    });
  }
};

/**
 * ADICIONAR DOCUMENTOS (JSON OU MULTIPART)
 * POST /properties/:id/documents
 */
export const addPropertyDocuments = async (req, res) => {
  try {
    const body = normalizeBody(req.body);

    const fileDocs = getAllUploadedFiles(req).map(toDoc);
    const jsonDocs = Array.isArray(body.documents)
      ? body.documents.map(asDocObject)
      : [];

    const incoming = [...fileDocs, ...jsonDocs];
    if (!incoming.length) {
      return res.status(400).json({ error: "No documents provided." });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $push: { documents: { $each: incoming } } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "Property not found." });
    res.json(updated);
  } catch (error) {
    console.error("Error adding documents:", error);
    res.status(400).json({ error: "Error adding documents.", message: error.message });
  }
};

/**
 * REMOVER UM DOCUMENTO ESPECÍFICO
 * DELETE /properties/:id/documents/:docId
 * - :docId pode ser o _id, a url, ou o name
 */
export const removePropertyDocument = async (req, res) => {
  const { id, docId } = req.params;

  try {
    let result = await Property.updateOne({ _id: id }, { $pull: { documents: { _id: docId } } });
    if (result.modifiedCount === 0) {
      result = await Property.updateOne({ _id: id }, { $pull: { documents: { url: docId } } });
    }
    if (result.modifiedCount === 0) {
      result = await Property.updateOne({ _id: id }, { $pull: { documents: { name: docId } } });
    }

    if (result.matchedCount === 0) return res.status(404).json({ error: "Property not found." });
    if (result.modifiedCount === 0) return res.status(404).json({ error: "Document not found in property." });

    const updated = await Property.findById(id).lean();
    res.json({ ok: true, property: updated });
  } catch (error) {
    console.error("Error removing document:", error);
    res.status(400).json({ error: "Error removing document.", message: error.message });
  }
};

/**
 * DELETAR IMÓVEL
 * DELETE /properties/:id
 */
export const removeProperty = async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ error: "Property not found." });
    res.json({ ok: true, deleted });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(400).json({ error: "Error deleting property.", message: error.message });
  }
};

// ---------------- utils ----------------

function normalizeBody(body = {}) {
  const out = { ...body };
  if (typeof out.documents === "string") {
    try {
      const parsed = JSON.parse(out.documents);
      if (Array.isArray(parsed)) out.documents = parsed;
    } catch {
      out.documents = [out.documents];
    }
  }
  return out;
}

// Multer File -> { name, url } (compatível com seu schema)
function toDoc(file) {
  return { name: file.originalname, url: `/uploads/${file.filename}` };
}

// JSON -> { name, url }; se vier string, trata como url e infere name
function asDocObject(x) {
  if (x && typeof x === "object") {
    if (x.url && !x.name) return { name: inferNameFromUrl(x.url), url: x.url };
    if (x.url && x.name) return { name: x.name, url: x.url };
    return x;
  }
  if (typeof x === "string") return { name: inferNameFromUrl(x), url: x };
  return x;
}

function inferNameFromUrl(u = "") {
  try {
    const p = u.split("?")[0].split("#")[0];
    const leaf = p.split("/").filter(Boolean).pop() || "document";
    return decodeURIComponent(leaf);
  } catch { return "document"; }
}

function validOrDefaultStatus(s) {
  const allowed = ["Available", "Occupied", "Under Maintenance"];
  return allowed.includes(s) ? s : "Available";
}

function firstNonEmpty(...vals) {
  for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  return undefined;
}

function escapeRegex(s) {
  return s?.toString().replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
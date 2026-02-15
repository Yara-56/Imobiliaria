import api from "./api";

// Função auxiliar para lidar com a construção do FormData de forma recursiva/inteligente
const buildFormData = (payload = {}, files = []) => {
  const fd = new FormData();

  // 1. Normalização de dados (Mantive sua lógica, mas isolada)
  const normalized = { ...payload };
  if (normalized.district || normalized.neighborhood) {
    normalized.bairro = (normalized.bairro || normalized.district || normalized.neighborhood || "").toString().trim();
    delete normalized.district;
    delete normalized.neighborhood;
  }

  // 2. Iteração inteligente
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];

    // Ignora undefined ou null
    if (value === undefined || value === null) return;

    // Se for Array (ex: features ids: [1, 5, 9]), anexa como 'key[]'
    if (Array.isArray(value)) {
      value.forEach((item) => {
        fd.append(`${key}[]`, item); 
      });
    } 
    // Se for Arquivo (caso venha misturado no payload)
    else if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    }
    // Caso padrão (String, Number, Boolean)
    else {
      fd.append(key, String(value));
    }
  });

  // 3. Anexa arquivos extras passados separadamente (ex: galeria de fotos)
  (files || []).forEach((file) => {
    fd.append("documents[]", file);
  });

  return fd;
};

export const propertyService = {
  /**
   * Listar Imóveis
   */
  getAll: async (params = {}) => {
    try {
      const { data } = await api.get("/properties", { params });
      // Garante retorno de array mesmo se a API falhar o formato
      return data.items || data.data || []; 
    } catch (error) {
      console.error("Erro no service listProperties", error);
      throw error;
    }
  },

  /**
   * Obter por ID
   */
  getById: async (id) => {
    const { data } = await api.get(`/properties/${id}`);
    return data;
  },

  /**
   * Criar
   */
  create: async (payload, files = []) => {
    const formData = buildFormData(payload, files);
    const { data } = await api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Explícito é melhor
    });
    return data;
  },

  /**
   * Atualizar
   */
  update: async (id, payload, newFiles = []) => {
    // Note: PATCH com FormData às vezes requer _method: 'PATCH' em alguns backends,
    // mas se seu backend aceita multipart em PATCH, está ótimo.
    const formData = buildFormData(payload, newFiles);
    const { data } = await api.patch(`/properties/${id}`, formData);
    return data;
  },

  /**
   * Deletar
   */
  delete: async (id) => {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
  },

  /**
   * Gestão de Documentos Isolada
   */
  addDocuments: async (id, newFiles = []) => {
    const formData = new FormData();
    (newFiles || []).forEach((file) => {
      formData.append("documents[]", file);
    });
    const { data } = await api.post(`/properties/${id}/documents`, formData);
    return data;
  },

  deleteDocument: async (id, docId) => {
    const { data } = await api.delete(`/properties/${id}/documents/${docId}`);
    return data;
  }
};
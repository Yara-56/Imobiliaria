import api from "@/core/api/api";

export const propertyApi = {
  list: async (params?: any, signal?: AbortSignal) => {
    const { data } = await api.get("/properties", { params, signal });
    return data.data || data;
  },

  create: async (data: Record<string, any>, files: File[]) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, String(value));
    });

    // aqui depende do back: você está usando 'images'
    files.forEach((file) => formData.append("images", file));

    const response = await api.post("/properties", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/properties/${id}`);
  },
};

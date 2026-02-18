import api from "@/core/api/api";

export const propertyService = {
  list: async (params: any, signal?: AbortSignal) => {
    const { data } = await api.get("/properties", { params, signal });
    return data.data || data;
  },
  create: async (data: any, files: File[]) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    files.forEach(file => formData.append('images', file));
    const response = await api.post("/properties", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/properties/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/properties/${id}`);
  }
};
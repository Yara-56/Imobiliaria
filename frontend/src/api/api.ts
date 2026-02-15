import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // Importante para enviar cookies se optar por eles
});

// Interceptor: Adiciona o Token automaticamente em todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('imobisys_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
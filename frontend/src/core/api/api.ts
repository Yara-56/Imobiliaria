import axios from 'axios';

const api = axios.create({
  // O Vite expõe as variáveis através do import.meta.env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Adicione isso para enviar o token automaticamente em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("imobisys_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;